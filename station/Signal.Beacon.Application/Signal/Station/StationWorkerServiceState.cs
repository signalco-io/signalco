using System;

namespace Signal.Beacon.Application.Signal.Station;

public class StationWorkerServiceState
{
    public StationWorkerServiceState(string entityId, Type workerServiceType, WorkerServiceState state = WorkerServiceState.Stopped)
    {
        this.EntityId = entityId;
        this.WorkerServiceType = workerServiceType;
        this.State = state;
    }

    public string EntityId { get; }

    public Type WorkerServiceType { get; set; }

    public WorkerServiceState State { get; set; }
}