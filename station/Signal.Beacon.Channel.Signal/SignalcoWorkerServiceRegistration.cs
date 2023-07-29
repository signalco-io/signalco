using System;
using Signal.Beacon.Core.Workers;

namespace Signal.Beacon.Channel.Signal;

internal sealed class SignalcoWorkerServiceRegistration : IWorkerServiceRegistration
{
    public string ChannelName => SignalChannels.DeviceChannel;

    public Type WorkerServiceType => typeof(SignalWorkerService);
}