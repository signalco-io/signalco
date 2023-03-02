using System.Collections.Generic;

namespace Signal.Beacon.Channel.Signal;

internal class SignalWorkerServiceConfiguration
{
    public List<MqttServer> Servers { get; set; } = new();

    public class MqttServer
    {
        public string? Url { get; set; }
    }
}