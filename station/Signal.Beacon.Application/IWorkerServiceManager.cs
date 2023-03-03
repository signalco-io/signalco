using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Signal.Beacon.Core.Workers;

namespace Signal.Beacon.Application;

public interface IWorkerServiceManager
{
    event EventHandler<IWorkerServiceManagerStateChangeEventArgs> OnChange;
    IEnumerable<IWorkerService> AvailableWorkerServices { get; }
    IEnumerable<IWorkerService> RunningWorkerServices { get; }
    Task StartAllWorkerServicesAsync(CancellationToken cancellationToken);
    Task StopAllWorkerServicesAsync();
    Task StartWorkerServiceAsync(IWorkerService workerService, CancellationToken stoppingToken);
    Task StopWorkerServiceAsync(IWorkerService workerService);
}