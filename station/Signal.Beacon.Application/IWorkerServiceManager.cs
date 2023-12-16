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
    Task StartAllInternalWorkerServicesAsync(CancellationToken cancellationToken = default);
    Task StartAllWorkerServicesAsync(CancellationToken cancellationToken = default);
    Task StopAllWorkerServicesAsync();
    Task StopAllInternalWorkerServicesAsync();
    Task StartWorkerServiceAsync(string entityId, CancellationToken cancellationToken = default);
    Task StopWorkerServiceAsync(string entityId, CancellationToken cancellationToken = default);
    Task BeginDiscoveryAsync(CancellationToken cancellationToken = default);
}