using System;

namespace Signal.Beacon.Core.Workers;

public interface IWorkerServiceRegistration
{
    string ChannelName { get; }

    Type WorkerServiceType { get; }
}