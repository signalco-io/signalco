using Signal.Beacon.Core.Workers;

namespace Signalco.Station.Channel.Shelly;

internal sealed class ShellyWorkerServiceRegistration : IWorkerServiceRegistration
{
    public string ChannelName => ShellyChannels.Shelly;

    public Type WorkerServiceType => typeof(ShellyWorkerService);
}