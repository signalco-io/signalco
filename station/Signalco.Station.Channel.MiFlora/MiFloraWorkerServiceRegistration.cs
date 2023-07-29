using Signal.Beacon.Core.Workers;

namespace Signalco.Station.Channel.MiFlora;

internal sealed class MiFloraWorkerServiceRegistration : IWorkerServiceRegistration
{
    public string ChannelName => MiFloraChannels.MiFlora;

    public Type WorkerServiceType => typeof(MiFloraWorkerService);
}