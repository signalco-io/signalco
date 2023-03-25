using System;
using Signal.Beacon.Core.Workers;

namespace Signal.Beacon.Application;

public interface IWorkerServiceManagerStateChangeEventArgs
{
    string EntityId { get; }

    Type WorkerServiceType { get; }

    IWorkerService? WorkerService { get; }

    WorkerServiceState State { get; }
}