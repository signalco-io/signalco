using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Signal.Beacon.Application;
using Signal.Beacon.Core.Workers;

namespace Signal.Beacon;

public class WorkerServiceManager : IWorkerServiceManager
{
    private readonly ILogger<WorkerServiceManager> logger;
    private readonly Lazy<IEnumerable<IWorkerService>> workerServices;
    private readonly List<IWorkerService> runningWorkers = new();

    public event EventHandler<IWorkerServiceManagerStateChangeEventArgs>? OnChange;

    public WorkerServiceManager(
        Lazy<IEnumerable<IWorkerService>> workerServices,
        ILogger<WorkerServiceManager> logger)
    {
        this.workerServices = workerServices ?? throw new ArgumentNullException(nameof(workerServices));
        this.logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public IEnumerable<IWorkerService> AvailableWorkerServices => this.workerServices.Value;

    public IEnumerable<IWorkerService> RunningWorkerServices => this.runningWorkers;

    public async Task StartAllWorkerServicesAsync(CancellationToken cancellationToken)
    {
        await Task.WhenAll(this.workerServices.Value.Select(async ws =>
        {
            await this.StartWorkerServiceAsync(ws, cancellationToken);
        }));
        this.logger.LogInformation("All worker services started.");
    }

    public async Task StopAllWorkerServicesAsync()
    {
        await Task.WhenAll(this.workerServices.Value.Select(async ws =>
        {
            await this.StopWorkerServiceAsync(ws);
        }));
    }

    public Task StartWorkerServiceAsync(IWorkerService workerService, CancellationToken stoppingToken)
    {
        return Task.Run(async () =>
        {
            try
            {
                this.logger.LogInformation("Starting {WorkerServiceName}...", workerService.GetType().Name);
                await workerService.StartAsync(stoppingToken);

                this.runningWorkers.Add(workerService);

                this.OnChange?.Invoke(
                    this,
                    new WorkerServiceManagerStateChangeEventArgs(workerService, WorkerServiceState.Running));

                this.logger.LogInformation("{WorkerServiceName} started", workerService.GetType().Name);
            }
            catch (Exception ex)
            {
                this.logger.LogError(ex, "Failed to start worker service {WorkerServiceName}",
                    workerService.GetType().Name);
            }
        }, stoppingToken);
    }

    public Task StopWorkerServiceAsync(IWorkerService workerService)
    {
        return Task.Run(async () =>
        {
            try
            {
                this.logger.LogInformation("Stopping {WorkerServiceName}...", workerService.GetType().Name);
                await workerService.StopAsync(CancellationToken.None);

                this.runningWorkers.Remove(workerService);

                this.OnChange?.Invoke(
                    this,
                    new WorkerServiceManagerStateChangeEventArgs(workerService, WorkerServiceState.Stopped));

                this.logger.LogInformation("{WorkerServiceName} stopped", workerService.GetType().Name);
            }
            catch (Exception ex)
            {
                this.logger.LogError(
                    ex,
                    "Service {WorkerServiceName} stopping failed.",
                    workerService.GetType().Name);
            }
        });
    }
}