using System;
using System.Text.Json.Serialization;

namespace Signal.Beacon.Channel.Zigbee2Mqtt;

[Serializable]
internal class BridgeDevice
{
    [JsonPropertyName("ieee_address")]
    public string? IeeeAddress { get; set; }

    [JsonPropertyName("friendly_name")]
    public string? FriendlyName { get; set;  }

    public BridgeDeviceDefinition? Definition { get; set; }
}