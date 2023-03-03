using System.Collections.Generic;

namespace Signal.Beacon.Channel.Zigbee2Mqtt;

internal class Zigbee2MqttWorkerServiceConfiguration
{
    public List<MqttServer> Servers { get; } = new();

    public class MqttServer
    {
        public string? Url { get; set; }
    }
}