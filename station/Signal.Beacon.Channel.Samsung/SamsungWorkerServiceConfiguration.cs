using System.Collections.Generic;

namespace Signal.Beacon.Channel.Samsung;

public class SamsungWorkerServiceConfiguration
{
    public List<SamsungTvRemoteConfig> TvRemotes { get; } = new();

    public class SamsungTvRemoteConfig
    {
        public SamsungTvRemoteConfig(string ipAddress, string? token = null)
        {
            this.IpAddress = ipAddress;
            this.Token = token;
        }

        public string IpAddress { get; }

        public string? Id { get; set; }

        public string? Token { get; set; }

        public string? MacAddress { get; set; }
    }
}