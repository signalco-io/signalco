using System;
using Signal.Beacon.Core.Workers;

namespace Signal.Beacon.Voice;

internal sealed class VoiceWorkerServiceRegistration : IWorkerServiceRegistration
{
    public string ChannelName => "voice";

    public Type WorkerServiceType => typeof(VoiceService);
}