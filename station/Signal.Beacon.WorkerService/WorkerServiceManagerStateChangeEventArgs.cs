using System;
using Signal.Beacon.Application;
using Signal.Beacon.Core.Workers;

namespace Signal.Beacon;

public class WorkerServiceManagerStateChangeEventArgs : EventArgs, IWorkerServiceManagerStateChangeEventArgs
{
    public WorkerServiceManagerStateChangeEventArgs(IWorkerService workerService, WorkerServiceState state)
    {
        this.WorkerService = workerService;
        this.State = state;
    }

    public IWorkerService WorkerService { get; }

    public WorkerServiceState State { get; }
}