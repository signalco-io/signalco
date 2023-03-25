using Signal.Beacon.Core.Workers;

namespace Signal.Beacon.Application;

public interface IWorkerServiceManagerStateChangeEventArgs
{
    string EntityId { get; }

    WorkerServiceState State { get; }
    IWorkerService? WorkerService { get; }
}