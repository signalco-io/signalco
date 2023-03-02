using System.Collections.Generic;

namespace Signal.Beacon.Channel.Tasmota;

internal class TasmotaWorkerServiceConfiguration
{
    public List<MqttServer> Servers { get; } = new();

    public class MqttServer
    {
        public string Url { get; }

        public MqttServer(string url)
        {
            this.Url = url;
        }
    }
}