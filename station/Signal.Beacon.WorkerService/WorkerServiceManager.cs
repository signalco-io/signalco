using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Signal.Beacon.Application;
using Signal.Beacon.Application.Signal.Station;
using Signal.Beacon.Core.Entity;
using Signal.Beacon.Core.Workers;

namespace Signal.Beacon;

internal interface IChannelWorkerServiceResolver
{
    Task<Type?> ResolveWorkerServiceTypeAsync(string entityId, CancellationToken cancellationToken = default);
}

internal class ChannelWorkerServiceResolver : IChannelWorkerServiceResolver
{
    public Task<Type?> ResolveWorkerServiceTypeAsync(string entityId, CancellationToken cancellationToken = default)
    {
        throw new NotImplementedException();
    }
}

internal class WorkerServiceManager : IWorkerServiceManager
{
    private readonly IServiceProvider serviceProvider;
    private readonly IEntitiesDao entitiesDao;
    private readonly IChannelWorkerServiceResolver channelWorkerServiceResolver;
    private readonly IStationStateService stationStateService;
    private readonly ILogger<WorkerServiceManager> logger;
    private readonly List<StationWorkerServiceOperation> workers = new();

    public event EventHandler<IWorkerServiceManagerStateChangeEventArgs>? OnChange;

    public IEnumerable<StationWorkerServiceState> WorkerServices => this.workers;

    public WorkerServiceManager(
        IServiceProvider serviceProvider,
        IEntitiesDao entitiesDao,
        IChannelWorkerServiceResolver channelWorkerServiceResolver,
        IStationStateService stationStateService,
        ILogger<WorkerServiceManager> logger)
    {
        this.serviceProvider = serviceProvider ?? throw new ArgumentNullException(nameof(serviceProvider));
        this.entitiesDao = entitiesDao ?? throw new ArgumentNullException(nameof(entitiesDao));
        this.channelWorkerServiceResolver = channelWorkerServiceResolver ?? throw new ArgumentNullException(nameof(channelWorkerServiceResolver));
        this.stationStateService = stationStateService ?? throw new ArgumentNullException(nameof(stationStateService));
        this.logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task StartAllWorkerServicesAsync(CancellationToken cancellationToken = default)
    {
        // Retrieve all channels with assigned station
        var stationState = await this.stationStateService.GetAsync(cancellationToken);
        var entities = await this.entitiesDao.AllAsync(cancellationToken);
        var assignedChannels = entities
            .Where(e => 
                e.Type == EntityType.Channel && 
                e.Contacts.Any(c => c.ContactName == "station" && c.ValueSerialized == stationState.Id));

        // Start all channels workers
        await Task.WhenAll(assignedChannels.Select(assignedChannel =>
            this.StartWorkerServiceAsync(assignedChannel.Id, cancellationToken)));

        this.logger.LogInformation("All worker services started.");
    }

    public async Task StopAllWorkerServicesAsync(CancellationToken cancellationToken = default) =>
        await Task.WhenAll(
            this.workers.Select(ews =>
                this.StopWorkerServiceAsync(ews.EntityId, cancellationToken)));

    public async Task StartWorkerServiceAsync(string entityId, CancellationToken cancellationToken = default)
    {
        try
        {
            var state = new StationWorkerServiceOperation(entityId);
            this.workers.Add(state);

            // Instantiate appropriate worker service
            var workerServiceType = await this.channelWorkerServiceResolver.ResolveWorkerServiceTypeAsync(entityId, cancellationToken);
            if (workerServiceType == null || 
                this.serviceProvider.GetService(workerServiceType) is not IWorkerService workerService)
                throw new InvalidOperationException($"Worker service not installed for {workerServiceType?.Name ?? "UNKNOWN"}");

            state.Instance = workerService;
            this.OnChange?.Invoke(
                this,
                new WorkerServiceManagerStateChangeEventArgs(entityId, WorkerServiceState.Running, state.Instance));

            this.logger.LogInformation("Starting {WorkerServiceName} on {EntityId}...", workerService.GetType().Name, entityId);
            await workerService.StartAsync(entityId, cancellationToken);

            state.State = WorkerServiceState.Running;

            this.OnChange?.Invoke(
                this,
                new WorkerServiceManagerStateChangeEventArgs(entityId, WorkerServiceState.Running, state.Instance));

            this.logger.LogInformation("Service {WorkerServiceName} on {EntityId} started", workerService.GetType().Name, entityId);
        }
        catch (Exception ex)
        {
            this.logger.LogError(ex, "Failed to start worker service for {EntityId}", entityId);
        }
    }

    public async Task StopWorkerServiceAsync(string entityId, CancellationToken cancellationToken = default)
    {
        try
        {
            // Get running worker service
            if (this.workers.FirstOrDefault(s => s.EntityId == entityId) is not { } state)
                return;

            if (state.State != WorkerServiceState.Running || 
                state.Instance == null)
                return;

            this.logger.LogInformation("Stopping service {WorkerServiceName} for {EntityId}...", state.Instance.GetType().Name, entityId);
            await state.Instance.StopAsync(CancellationToken.None);

            state.State = WorkerServiceState.Stopped;
            state.Instance = null;

            this.OnChange?.Invoke(
                this,
                new WorkerServiceManagerStateChangeEventArgs(entityId, WorkerServiceState.Stopped, null));

            this.logger.LogInformation("Service for {EntityId} stopped",  entityId);
        }
        catch (Exception ex)
        {
            this.logger.LogError(
                ex,
                "Service {EntityId} stopping failed.",
                entityId);
        }
    }
    
    public void BeginDiscovery()
    {
        throw new NotImplementedException();
    }

    private class StationWorkerServiceOperation : StationWorkerServiceState
    {
        public StationWorkerServiceOperation(string entityId, WorkerServiceState state = WorkerServiceState.Stopped) 
            : base(entityId, state)
        {
        }

        public IWorkerService? Instance { get; set; }
    }
}