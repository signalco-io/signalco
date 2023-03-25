using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Signal.Beacon.Application;
using Signal.Beacon.Application.Signal.Station;
using Signal.Beacon.Core.Workers;

namespace Signal.Beacon;

public class WorkerServiceManager : IWorkerServiceManager
{
    private readonly IServiceProvider serviceProvider;
    private readonly ILogger<WorkerServiceManager> logger;
    private readonly List<StationWorkerServiceOperation> workers = new();

    public event EventHandler<IWorkerServiceManagerStateChangeEventArgs>? OnChange;

    public IEnumerable<StationWorkerServiceState> WorkerServices => this.workers;

    public WorkerServiceManager(
        IServiceProvider serviceProvider,
        ILogger<WorkerServiceManager> logger)
    {
        this.serviceProvider = serviceProvider ?? throw new ArgumentNullException(nameof(serviceProvider));
        this.logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task StartAllWorkerServicesAsync(CancellationToken cancellationToken = default)
    {
        // TODO: Retrieve all channels with assigned station


        this.logger.LogInformation("All worker services started.");
    }

    public async Task StopAllWorkerServicesAsync(CancellationToken cancellationToken = default) =>
        await Task.WhenAll(
            this.workers.Select(ews =>
                this.StopWorkerServiceAsync(ews.EntityId, ews.GetType(), cancellationToken)));

    public async Task StartWorkerServiceAsync(string entityId, Type workerServiceType, CancellationToken cancellationToken = default)
    {
        try
        {
            var state = new StationWorkerServiceOperation(entityId, workerServiceType);
            this.workers.Add(state);

            if (this.serviceProvider.GetService(workerServiceType) is not IWorkerService workerService)
                throw new InvalidOperationException($"Worker service not installed for {workerServiceType.Name}");

            state.Instance = workerService;
            this.OnChange?.Invoke(
                this,
                new WorkerServiceManagerStateChangeEventArgs(entityId, workerServiceType, state.Instance, WorkerServiceState.Running));

            this.logger.LogInformation("Starting {WorkerServiceName} on {EntityId}...", workerService.GetType().Name, entityId);
            await workerService.StartAsync(entityId, cancellationToken);

            state.State = WorkerServiceState.Running;

            this.OnChange?.Invoke(
                this,
                new WorkerServiceManagerStateChangeEventArgs(entityId, workerServiceType, state.Instance, WorkerServiceState.Running));

            this.logger.LogInformation("{WorkerServiceName} on {EntityId} started", workerService.GetType().Name, entityId);
        }
        catch (Exception ex)
        {
            this.logger.LogError(ex, "Failed to start worker service {WorkerServiceName} on {EntityId}", workerServiceType.Name, entityId);
        }
    }

    public async Task StopWorkerServiceAsync(string entityId, Type workerServiceType, CancellationToken cancellationToken = default)
    {
        try
        {
            // Get running worker service
            if (this.workers.FirstOrDefault(s => s.EntityId == entityId && s.GetType() == workerServiceType) is not { } state)
                return;

            if (state.State != WorkerServiceState.Running || 
                state.Instance == null)
                return;

            this.logger.LogInformation("Stopping {WorkerServiceName} on {EntityId}...", state.GetType().Name, entityId);
            await state.Instance.StopAsync(CancellationToken.None);

            state.State = WorkerServiceState.Stopped;
            state.Instance = null;

            this.OnChange?.Invoke(
                this,
                new WorkerServiceManagerStateChangeEventArgs(entityId, workerServiceType, null, WorkerServiceState.Stopped));

            this.logger.LogInformation("{WorkerServiceName} on {EntityId} stopped", state.GetType().Name, entityId);
        }
        catch (Exception ex)
        {
            this.logger.LogError(
                ex,
                "Service {WorkerServiceName} on {EntityId} stopping failed.",
                workerServiceType.Name, entityId);
        }
    }

    private class StationWorkerServiceOperation : StationWorkerServiceState
    {
        public StationWorkerServiceOperation(string entityId, Type workerServiceType, WorkerServiceState state = WorkerServiceState.Stopped) 
            : base(entityId, workerServiceType, state)
        {
        }

        public IWorkerService? Instance { get; set; }
    }
}