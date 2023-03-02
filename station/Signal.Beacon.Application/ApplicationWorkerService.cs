using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Signal.Beacon.Application.Conducts;
using Signal.Beacon.Application.Lifetime;
using Signal.Beacon.Application.Processing;
using Signal.Beacon.Application.Signal.SignalR;
using Signal.Beacon.Application.Signal.Station;
using Signal.Beacon.Core.Conducts;
using Signal.Beacon.Core.Configuration;
using Signal.Beacon.Core.Workers;

namespace Signal.Beacon.Application;

internal class ApplicationWorkerService : IWorkerService
{
    private readonly IProcessor processor;
    private readonly ISignalSignalRDevicesHubClient devicesHubClient;
    private readonly ISignalSignalRConductsHubClient conductsHubClient;
    private readonly IConductSubscriberClient conductSubscriberClient;
    private readonly IUpdateService updateService;
    private readonly IConfigurationService configurationService;
    private readonly IConductManager conductManager;
    private readonly IWorkerServiceManager workerServiceManager;
    private readonly ILogger<ApplicationWorkerService> logger;

    public ApplicationWorkerService(
        IProcessor processor,
        ISignalSignalRDevicesHubClient devicesHubClient,
        ISignalSignalRConductsHubClient conductsHubClient,
        IConductSubscriberClient conductSubscriberClient,
        IUpdateService updateService,
        IConfigurationService configurationService,
        IConductManager conductManager,
        IWorkerServiceManager workerServiceManager,
        ILogger<ApplicationWorkerService> logger)
    {
        this.processor = processor ?? throw new ArgumentNullException(nameof(processor));
        this.devicesHubClient = devicesHubClient ?? throw new ArgumentNullException(nameof(devicesHubClient));
        this.conductsHubClient = conductsHubClient ?? throw new ArgumentNullException(nameof(conductsHubClient));
        this.conductSubscriberClient = conductSubscriberClient ?? throw new ArgumentNullException(nameof(conductSubscriberClient));
        this.updateService = updateService ?? throw new ArgumentNullException(nameof(updateService));
        this.configurationService = configurationService ?? throw new ArgumentNullException(nameof(configurationService));
        this.conductManager = conductManager ?? throw new ArgumentNullException(nameof(conductManager));
        this.workerServiceManager = workerServiceManager ?? throw new ArgumentNullException(nameof(workerServiceManager));
        this.logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }
        
    public async Task StartAsync(CancellationToken cancellationToken)
    {
        _ = this.devicesHubClient.StartAsync(cancellationToken);
        _ = this.conductsHubClient.StartAsync(cancellationToken);
        await this.processor.StartAsync(cancellationToken);
        await this.conductManager.StartAsync(cancellationToken);
            
        this.conductSubscriberClient.Subscribe("station", this.StationConductHandler);
    }

    private async Task StationConductHandler(IEnumerable<IConduct> conducts, CancellationToken cancellationToken)
    {
        this.logger.LogDebug("Processing station conducts...");
            
        var config = await this.configurationService.LoadAsync<StationConfiguration>("beacon.json", cancellationToken);
        if (string.IsNullOrWhiteSpace(config.Id))
            throw new Exception("Can't generate state report without id.");
            
        foreach (var conduct in conducts)
        {
            // Skip if not for this station
            if (conduct.Pointer.EntityId != config.Id)
            {
                this.logger.LogDebug("Ignored conduct because target is not this station. Conduct: {@Conduct}", conduct);
                continue;
            }

            switch (conduct.Pointer.ContactName)
            {
                case "update":
                    await this.updateService.BeginUpdateAsync(cancellationToken);
                    break;
                case "restartStation":
                    await this.updateService.RestartStationAsync();
                    break;
                case "updateSystem":
                    await this.updateService.UpdateSystemAsync(cancellationToken);
                    break;
                case "restartSystem":
                    await this.updateService.RestartSystemAsync();
                    break;
                case "shutdownSystem":
                    await this.updateService.ShutdownSystemAsync();
                    break;
                case "workerService:start":
                    await this.StartWorkerServiceAsync(conduct.ValueSerialized ?? throw new InvalidOperationException("Provide worker service name"), cancellationToken);
                    break;
                case "workerService:stop":
                    await this.StopWorkerServiceAsync(conduct.ValueSerialized ?? throw new InvalidOperationException("Provide worker service name"), cancellationToken);
                    break;
                case "beginDiscovery":
                    await this.BeginWorkersDiscoveryAsync(cancellationToken);
                    break;
                default:
                    throw new NotSupportedException("Not supported station conduct.");
            }
        }
    }

    private async Task StopWorkerServiceAsync(string workerServiceTypeFullName, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(workerServiceTypeFullName))
            throw new ArgumentException("Value cannot be null or whitespace.", nameof(workerServiceTypeFullName));

        var ws = this.workerServiceManager.AvailableWorkerServices.FirstOrDefault(ws =>
            ws.GetType().FullName == workerServiceTypeFullName);
        if (ws == null)
            throw new Exception("Requested worker service not available.");

        await this.workerServiceManager.StopWorkerServiceAsync(ws);
    }

    private async Task StartWorkerServiceAsync(string workerServiceTypeFullName, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(workerServiceTypeFullName))
            throw new ArgumentException("Value cannot be null or whitespace.", nameof(workerServiceTypeFullName));

        var ws = this.workerServiceManager.AvailableWorkerServices.FirstOrDefault(ws =>
            ws.GetType().FullName == workerServiceTypeFullName);
        if (ws == null)
            throw new Exception("Requested worker service not available.");

        await this.workerServiceManager.StartWorkerServiceAsync(ws, cancellationToken);
    }

    private async Task BeginWorkersDiscoveryAsync(CancellationToken cancellationToken)
    {
        foreach (var workerWithDiscovery in this.workerServiceManager.RunningWorkerServices.OfType<IWorkerServiceWithDiscovery>())
        {
            await workerWithDiscovery.BeginDiscoveryAsync(cancellationToken);
        }
    }

    public Task StopAsync(CancellationToken cancellationToken)
    {
        return Task.CompletedTask;
    }
}