using System;
using Signal.Beacon.Application;
using Signal.Beacon.Core.Workers;

namespace Signal.Beacon;

public class WorkerServiceManagerStateChangeEventArgs : EventArgs, IWorkerServiceManagerStateChangeEventArgs
{
    public WorkerServiceManagerStateChangeEventArgs(
        string entityId, 
        WorkerServiceState state,
        IWorkerService? workerService)
    {
        this.WorkerService = workerService;
        this.State = state;
        this.EntityId = entityId;
    }

    public string EntityId { get; }
    public IWorkerService? WorkerService { get; }
    public WorkerServiceState State { get; }
}