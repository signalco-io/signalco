using System.Collections.Generic;

namespace Signal.Beacon.Application.Signal.Station;

public class StationState
{
    public string Id { get; init; }

    public string Version { get; init; }

    public IEnumerable<StationWorkerServiceState> WorkerServices { get; init; }
}