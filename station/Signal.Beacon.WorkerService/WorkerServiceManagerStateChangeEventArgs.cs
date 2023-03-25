using System;
using Signal.Beacon.Application;
using Signal.Beacon.Core.Workers;

namespace Signal.Beacon;

public class WorkerServiceManagerStateChangeEventArgs : EventArgs, IWorkerServiceManagerStateChangeEventArgs
{
    public WorkerServiceManagerStateChangeEventArgs(
        string entityId, 
        Type workerServiceType,
        IWorkerService? workerService, 
        WorkerServiceState state)
    {
        this.WorkerService = workerService;
        this.State = state;
        this.EntityId = entityId;
        this.WorkerServiceType = workerServiceType;
    }

    public string EntityId { get; }
    public Type WorkerServiceType { get; }
    public IWorkerService? WorkerService { get; }
    public WorkerServiceState State { get; }
}