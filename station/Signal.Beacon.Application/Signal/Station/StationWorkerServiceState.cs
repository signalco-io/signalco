namespace Signal.Beacon.Application.Signal.Station;

public class StationWorkerServiceState
{
    public StationWorkerServiceState(string entityId, WorkerServiceState state = WorkerServiceState.Stopped)
    {
        this.EntityId = entityId;
        this.State = state;
    }

    public string EntityId { get; }

    public WorkerServiceState State { get; set; }
}