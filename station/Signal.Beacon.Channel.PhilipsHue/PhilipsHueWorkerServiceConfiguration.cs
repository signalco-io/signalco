using System.Collections.Generic;

namespace Signal.Beacon.Channel.PhilipsHue;

internal class PhilipsHueWorkerServiceConfiguration
{
    public List<BridgeConfig> Bridges { get; } = new();
}