using Signal.Beacon.Core.Workers;

namespace Signal.Beacon.Application;

public interface IWorkerServiceManagerStateChangeEventArgs
{
    IWorkerService WorkerService { get; }

    WorkerServiceState State { get; }
}