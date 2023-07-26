using System;
using Signal.Beacon.Core.Workers;

namespace Signal.Beacon.Channel.Samsung;

internal sealed class SamsungWorkerServiceRegistration : IWorkerServiceRegistration
{
    public string ChannelName => SamsungChannels.SamsungChannel;

    public Type WorkerServiceType => typeof(SamsungWorkerService);
}