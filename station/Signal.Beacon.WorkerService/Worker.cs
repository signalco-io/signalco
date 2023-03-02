using System;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Signal.Beacon.Application;
using Signal.Beacon.Application.Auth;
using Signal.Beacon.Application.Auth0;
using Signal.Beacon.Application.Signal.Client;
using Signal.Beacon.Application.Signal.Station;
using Signal.Beacon.Core.Configuration;
using Signal.Beacon.Core.Entity;

namespace Signal.Beacon;

public class Worker : BackgroundService
{
    private readonly ISignalcoClientAuthFlow signalcoClientAuthFlow;
    private readonly IEntityService entityService;
    private readonly IConfigurationService configurationService;
    private readonly IWorkerServiceManager workerServiceManager;
    private readonly IStationStateManager stationStateManager;
    private readonly ILogger<Worker> logger;

    public Worker(
        ISignalcoClientAuthFlow signalcoClientAuthFlow,
        IEntityService entityService,
        IConfigurationService configurationService,
        IWorkerServiceManager workerServiceManager,
        IStationStateManager stationStateManager,
        ILogger<Worker> logger)
    {
        this.signalcoClientAuthFlow = signalcoClientAuthFlow ?? throw new ArgumentNullException(nameof(signalcoClientAuthFlow));
        this.entityService = entityService ?? throw new ArgumentNullException(nameof(entityService));
        this.configurationService = configurationService ?? throw new ArgumentNullException(nameof(configurationService));
        this.workerServiceManager = workerServiceManager ?? throw new ArgumentNullException(nameof(workerServiceManager));
        this.stationStateManager = stationStateManager;
        this.logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        // Load configuration
        var config = await this.configurationService.LoadAsync<StationConfiguration>("beacon.json", stoppingToken);
        if (config.Token == null || config.Id == null)
        {
            this.logger.LogInformation("Beacon not registered. Started registration...");
                
            try
            {
                // Authorize Beacon
                var deviceCodeResponse = await new Auth0DeviceAuthorization().GetDeviceCodeAsync(stoppingToken);
                this.logger.LogInformation("Device auth: {Response}",
                    JsonSerializer.Serialize(deviceCodeResponse));
                    
                // TODO: Post device flow request to user (CTA)
                    
                var token = await new Auth0DeviceAuthorization().WaitTokenAsync(deviceCodeResponse, stoppingToken);
                if (token == null)
                    throw new Exception("Token response not received");
                this.logger.LogInformation("Authorized successfully");

                // Register Beacon
                this.signalcoClientAuthFlow.AssignToken(token);
                var id = await this.entityService.UpsertAsync(
                    EntityType.Station,
                    null,
                    "Signalco Station",
                    stoppingToken);
                config.Id = id;
                config.Token = token;
                await this.configurationService.SaveAsync("beacon.json", config, stoppingToken);
                
                this.logger.LogInformation("Token saved");
                this.logger.LogInformation("Registered successfully as {Id}", id);
            }
            catch (Exception ex)
            {
                this.logger.LogError(ex, "Failed to register Beacon. Some functionality will be limited.");
            }
        }
        else
        {
            this.signalcoClientAuthFlow.AssignToken(config.Token);
        }

        this.signalcoClientAuthFlow.OnTokenRefreshed += this.SignalcoClientAuthFlowOnOnTokenRefreshed;

        // Start state reporting
        await this.stationStateManager.BeginMonitoringStateAsync(stoppingToken);

        // Start worker services
        await this.workerServiceManager.StartAllWorkerServicesAsync(stoppingToken);

        // Wait for cancellation token
        while (!stoppingToken.IsCancellationRequested)
            await Task.WhenAny(Task.Delay(-1, stoppingToken));

        // Stop services
        await this.workerServiceManager.StopAllWorkerServicesAsync();
    }

    private async void SignalcoClientAuthFlowOnOnTokenRefreshed(object? sender, AuthToken? e)
    {
        try
        {
            var config =
                await this.configurationService.LoadAsync<StationConfiguration>("Beacon.json",
                    CancellationToken.None);
            config.Token = e;
            await this.configurationService.SaveAsync("Beacon.json", config, CancellationToken.None);
        }
        catch (Exception ex)
        {
            this.logger.LogWarning(ex, "Failed to persist refreshed token.");
        }
    }
}