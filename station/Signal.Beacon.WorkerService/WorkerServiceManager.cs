using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Signal.Beacon.Application;
using Signal.Beacon.Application.Signal.Station;
using Signal.Beacon.Core.Entity;
using Signal.Beacon.Core.Workers;

namespace Signal.Beacon;

internal class WorkerServiceManager : IWorkerServiceManager
{
    private readonly IServiceProvider serviceProvider;
    private readonly IEntitiesDao entitiesDao;
    private readonly IChannelWorkerServiceResolver channelWorkerServiceResolver;
    private readonly IStationStateService stationStateService;
    private readonly ILogger<WorkerServiceManager> logger;
    private readonly List<StationWorkerServiceOperation> workers = new();
    private readonly List<IInternalWorkerService> internalWorkers = new();

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

    public async Task StartAllInternalWorkerServicesAsync(CancellationToken cancellationToken)
    {
        var internalServices = this.serviceProvider.GetServices<IInternalWorkerService>();
        await Task.WhenAll(internalServices.Select(iws =>
        {
            this.internalWorkers.Add(iws);
            return iws.StartAsync(cancellationToken);
        }));
    }

    public async Task StartAllWorkerServicesAsync(CancellationToken cancellationToken = default)
    {
        // Retrieve all channels with assigned station
        var stationState = await this.stationStateService.GetAsync(cancellationToken);
        var entities = await this.entitiesDao.AllAsync(cancellationToken);
        var assignedChannels = entities
            .Where(e =>
                e.Type == EntityType.Channel &&
                e.Contacts.Any(c =>
                    c.ContactName == KnownContacts.ChannelStationId &&
                    c.ValueSerialized == stationState.Id));

        var applicableChannels = assignedChannels
            .Where(c => (c.ContactOrDefault("signalco", "disabled").ValueSerialized?.ToLowerInvariant() ?? "false") != "true");

        // Start all channels workers
        await Task.WhenAll(applicableChannels.Select(assignedChannel =>
            this.StartWorkerServiceAsync(assignedChannel.Id, cancellationToken))); 

        this.logger.LogInformation("All worker services started.");
    }

    public async Task StopAllWorkerServicesAsync()
    {
        await Task.WhenAll(
            this.workers.Select(ews =>
                this.StopWorkerServiceAsync(ews.EntityId)));
    }

    public async Task StopAllInternalWorkerServicesAsync()
    {
        try
        {
            await Task.WhenAll(this.internalWorkers.Select(iws => iws.StopAsync()));
        }
        finally
        {
            this.internalWorkers.Clear();
        }
    }

    public async Task StartWorkerServiceAsync(string entityId, CancellationToken cancellationToken = default)
    {
        var state = this.workers.FirstOrDefault(s => s.EntityId == entityId);
        if (state == null)
        {
            state = new StationWorkerServiceOperation(entityId);
            this.workers.Add(state);
        }

        try
        {
            // Instantiate appropriate worker service instance
            if (state.Instance == null)
            {
                var workerServiceType =
                    await this.channelWorkerServiceResolver.ResolveWorkerServiceTypeAsync(entityId, cancellationToken);
                if (workerServiceType == null)
                    throw new InvalidOperationException(
                        $"Worker service not installed for {workerServiceType?.Name ?? "UNKNOWN"}");
                var workerServiceInstance = this.serviceProvider.GetService(workerServiceType);
                if (workerServiceInstance is not IWorkerService workerService)
                    throw new InvalidOperationException(
                        $"Worker service {workerServiceType.Name} failed to initialize.");
                state.Instance = workerService;
                this.OnChange?.Invoke(
                    this,
                    new WorkerServiceManagerStateChangeEventArgs(entityId, state.State, state.Instance));
            }

            // Start the worker
            if (state.State != WorkerServiceState.Running)
            {
                this.logger.LogInformation("Starting {WorkerServiceName} on {EntityId}...",
                    state.Instance.GetType().Name, entityId);
                await state.Instance.StartAsync(entityId, cancellationToken);
                this.logger.LogInformation("Service {WorkerServiceName} on {EntityId} started",
                    state.Instance.GetType().Name, entityId);
                state.State = WorkerServiceState.Running;
                this.OnChange?.Invoke(
                    this,
                    new WorkerServiceManagerStateChangeEventArgs(entityId, state.State, state.Instance));
            }
        }
        catch (Exception ex)
        {
            this.logger.LogError(ex, "Failed to start worker service for {EntityId}", entityId);
            state.State = WorkerServiceState.Stopped;
            this.OnChange?.Invoke(
                this,
                new WorkerServiceManagerStateChangeEventArgs(entityId, state.State, state.Instance));
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
            await state.Instance.StopAsync();

            state.State = WorkerServiceState.Stopped;
            state.Instance = null;

            this.OnChange?.Invoke(
                this,
                new WorkerServiceManagerStateChangeEventArgs(entityId, state.State, null));

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
    
    public async Task BeginDiscoveryAsync(CancellationToken cancellationToken = default)
    {
        foreach (var workerService in this.workers.ToList())
        {
            if (workerService.Instance is IWorkerServiceWithDiscovery workerServiceWithDiscovery)
            {
                await workerServiceWithDiscovery.BeginDiscoveryAsync(cancellationToken);
            }
        }
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