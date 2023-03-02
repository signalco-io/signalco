using System.Collections.Generic;

namespace Signal.Beacon.Channel.Zigbee2Mqtt;

internal class BridgeDeviceExposeFeature
{
    public BridgeDeviceExposeFeatureAccess Access { get; set; }

    public string? Property { get; set; }

    public string? Type { get; set; }

    public string? Unit { get; set; }

    public string? Description { get; set; }

    public List<BridgeDeviceExposeFeature>? Features { get; set; }

    public IEnumerable<string>? Values { get; set; }
}