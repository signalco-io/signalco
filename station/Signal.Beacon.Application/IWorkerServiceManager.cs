using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Signal.Beacon.Application.Signal.Station;

namespace Signal.Beacon.Application;

public interface IWorkerServiceManager
{
    event EventHandler<IWorkerServiceManagerStateChangeEventArgs> OnChange;
    IEnumerable<StationWorkerServiceState> WorkerServices { get; }
    Task StartAllWorkerServicesAsync(CancellationToken cancellationToken = default);
    Task StopAllWorkerServicesAsync(CancellationToken cancellationToken = default);
    Task StartWorkerServiceAsync(string entityId, Type workerServiceType, CancellationToken cancellationToken = default);
    Task StopWorkerServiceAsync(string entityId, Type workerServiceType, CancellationToken cancellationToken = default);
}