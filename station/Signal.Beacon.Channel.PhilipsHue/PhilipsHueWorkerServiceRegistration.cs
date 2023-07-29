using System;
using Signal.Beacon.Core.Workers;

namespace Signal.Beacon.Channel.PhilipsHue;

internal sealed class PhilipsHueWorkerServiceRegistration : IWorkerServiceRegistration
{
    public string ChannelName => PhilipsHueChannels.DeviceChannel;

    public Type WorkerServiceType => typeof(PhilipsHueWorkerService);
}