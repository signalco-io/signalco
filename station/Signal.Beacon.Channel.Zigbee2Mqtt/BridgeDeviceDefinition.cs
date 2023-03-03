using System.Collections.Generic;

namespace Signal.Beacon.Channel.Zigbee2Mqtt;

internal class BridgeDeviceDefinition
{
    public string? Model { get; set; }

    public string? Vendor { get; set; }

    public string? Description { get; set; }

    public List<BridgeDeviceExposeFeature>? Exposes { get; set; }
}