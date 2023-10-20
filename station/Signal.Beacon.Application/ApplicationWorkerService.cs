using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Signal.Beacon.Application.Conducts;
using Signal.Beacon.Application.Lifetime;
using Signal.Beacon.Application.Signal.SignalR;
using Signal.Beacon.Application.Signal.Station;
using Signal.Beacon.Core.Conducts;
using Signal.Beacon.Core.Entity;
using Signal.Beacon.Core.Workers;

namespace Signal.Beacon.Application;

internal class ApplicationWorkerService : IInternalWorkerService
{
    private readonly ISignalSignalRDevicesHubClient devicesHubClient;
    private readonly ISignalSignalRConductsHubClient conductsHubClient;
    private readonly IConductSubscriberClient conductSubscriberClient;
    private readonly IUpdateService updateService;
    private readonly IConductManager conductManager;
    private readonly IWorkerServiceManager workerServiceManager;
    private readonly IStationStateService stationStateService;
    private readonly IEntityService entityService;
    private readonly ILogger<ApplicationWorkerService> logger;

    public ApplicationWorkerService(
        ISignalSignalRDevicesHubClient devicesHubClient,
        ISignalSignalRConductsHubClient conductsHubClient,
        IConductSubscriberClient conductSubscriberClient,
        IUpdateService updateService,
        IConductManager conductManager,
        IWorkerServiceManager workerServiceManager,
        IStationStateService stationStateService,
        IEntityService entityService,
        ILogger<ApplicationWorkerService> logger)
    {
        this.devicesHubClient = devicesHubClient ?? throw new ArgumentNullException(nameof(devicesHubClient));
        this.conductsHubClient = conductsHubClient ?? throw new ArgumentNullException(nameof(conductsHubClient));
        this.conductSubscriberClient = conductSubscriberClient ?? throw new ArgumentNullException(nameof(conductSubscriberClient));
        this.updateService = updateService ?? throw new ArgumentNullException(nameof(updateService));
        this.conductManager = conductManager ?? throw new ArgumentNullException(nameof(conductManager));
        this.workerServiceManager = workerServiceManager ?? throw new ArgumentNullException(nameof(workerServiceManager));
        this.stationStateService = stationStateService ?? throw new ArgumentNullException(nameof(stationStateService));
        this.entityService = entityService ?? throw new ArgumentNullException(nameof(entityService));
        this.logger = logger ?? throw new ArgumentNullException(nameof(logger));

        // TODO: Move mDNS discovery out of here
        //this.discovery = new ServiceDiscovery(
        //    loggerFactory,
        //    loggerFactory.CreateLogger<ServiceDiscovery>());
        //this.discovery.Start();
        //this.discovery.ServiceInstanceDiscovered += DiscoveryOnServiceInstanceDiscovered;
    }
    
    // TODO: Move to Network channel
    //private async void DiscoveryOnServiceInstanceDiscovered(object? sender, ServiceInstanceDiscoveryEventArgs e)
    //{
    //    this.logger.LogInformation("Service discovered: {Name} @ {Endpoint}\nMessage: {Message}", e.ServiceInstanceName, e.RemoteEndPoint?.Address, e.Message);

    //    if (e.ServiceInstanceName.Labels.Any(l => l.StartsWith("shelly")))
    //    {
    //        var addresses = e.Message.Answers.Where(a => a.Type == DnsType.A).ToList();
    //        var address = addresses.FirstOrDefault() as ARecord;
    //        if (address != null)
    //        {
    //            var ipv4Address = address.Address;
    //            var entities = await this.entitiesDao.GetByContactValueAsync(
    //                "network", "ipv4", ipv4Address.ToString());
    //            var entitiesList = entities.ToList();
    //            if (!entitiesList.Any())
    //            {
    //                var newEntityId = await this.entityService.UpsertAsync(EntityType.Device, null, e.ServiceInstanceName.Labels[0]);
    //                var newEntity = await this.entitiesDao.GetAsync(newEntityId);
    //                if (newEntity != null)
    //                {
    //                    entitiesList = new List<IEntityDetails> {newEntity};
    //                }
    //            }

    //            foreach (var entityDetails in entitiesList)
    //            {
    //                await this.entityService.ContactSetAsync(
    //                    new ContactPointer(entityDetails.Id, "network", "ipv4"),
    //                    ipv4Address.ToString());
    //            }
    //        }
    //    }
    //}

    public async Task StartAsync(CancellationToken cancellationToken)
    {
        _ = this.devicesHubClient.StartAsync(cancellationToken);
        _ = this.conductsHubClient.StartAsync(cancellationToken);
        await this.conductManager.StartAsync(cancellationToken);
        await this.RegisterStationConductsAsync(cancellationToken);

        this.conductSubscriberClient.Subscribe("station", this.StationConductHandler);
    }

    private async Task RegisterStationConductsAsync(CancellationToken cancellationToken = default)
    {
        var state = await this.stationStateService.GetAsync(cancellationToken);
        if (string.IsNullOrWhiteSpace(state.Id))
            throw new Exception("Can't register conducts without station id");

        await this.entityService.ContactSetAsync(new ContactPointer(state.Id, ChannelNames.StationDevice, "update"), null, cancellationToken);
        await this.entityService.ContactSetAsync(new ContactPointer(state.Id, ChannelNames.StationDevice, "restartStation"), null, cancellationToken);
        await this.entityService.ContactSetAsync(new ContactPointer(state.Id, ChannelNames.StationDevice, "updateSystem"), null, cancellationToken);
        await this.entityService.ContactSetAsync(new ContactPointer(state.Id, ChannelNames.StationDevice, "restartSystem"), null, cancellationToken);
        await this.entityService.ContactSetAsync(new ContactPointer(state.Id, ChannelNames.StationDevice, "shutdownSystem"), null, cancellationToken);
        await this.entityService.ContactSetAsync(new ContactPointer(state.Id, ChannelNames.StationDevice, "workerService:start"), null, cancellationToken);
        await this.entityService.ContactSetAsync(new ContactPointer(state.Id, ChannelNames.StationDevice, "workerService:stop"), null, cancellationToken);
        await this.entityService.ContactSetAsync(new ContactPointer(state.Id, ChannelNames.StationDevice, "beginDiscovery"), null, cancellationToken);
    }

    private async Task StationConductHandler(IEnumerable<IConduct> conducts, CancellationToken cancellationToken)
    {
        this.logger.LogDebug("Processing station conducts...");

        var state = await this.stationStateService.GetAsync(cancellationToken);
        if (string.IsNullOrWhiteSpace(state.Id))
            throw new Exception("Can't process conduct without station id");
            
        foreach (var conduct in conducts)
        {
            // Skip if not for this station
            if (conduct.Pointer.EntityId != state.Id)
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
                    await this.StartWorkerServiceAsync(conduct.ValueSerialized 
                                                       ?? throw new InvalidOperationException("Provide channel entity ID"), cancellationToken);
                    break;
                case "workerService:stop":
                    await this.StopWorkerServiceAsync(conduct.ValueSerialized 
                                                      ?? throw new InvalidOperationException("Provide channel entity ID"), cancellationToken);
                    break;
                case "beginDiscovery":
                    await this.workerServiceManager.BeginDiscoveryAsync(cancellationToken);
                    break;
                default:
                    throw new NotSupportedException("Not supported station conduct.");
            }
        }
    }

    private async Task StopWorkerServiceAsync(string entityId, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(entityId))
            throw new ArgumentException("Value cannot be null or whitespace.", nameof(entityId));

        var ws = this.workerServiceManager.WorkerServices.FirstOrDefault(ws => ws.EntityId == entityId);
        if (ws == null)
            throw new Exception("Requested worker service not available.");

        await this.workerServiceManager.StopWorkerServiceAsync(entityId, cancellationToken);
    }

    private async Task StartWorkerServiceAsync(string entityId, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(entityId))
            throw new ArgumentException("Value cannot be null or whitespace.", nameof(entityId));

        var ws = this.workerServiceManager.WorkerServices.FirstOrDefault(ws => ws.EntityId == entityId);
        if (ws == null)
            throw new Exception("Requested worker service not available.");

        await this.workerServiceManager.StartWorkerServiceAsync(entityId, cancellationToken);
    }

    public Task StopAsync()
    {
        // TODO: Maybe stop all workers here?
        return Task.CompletedTask;
    }
}