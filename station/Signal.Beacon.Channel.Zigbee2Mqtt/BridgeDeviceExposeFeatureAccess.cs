using System;

namespace Signal.Beacon.Channel.Zigbee2Mqtt;

[Flags]
internal enum BridgeDeviceExposeFeatureAccess
{
    Unknown = 0,
    Readonly = 0x1,
    Write = 0x2,
    Request = 0x4
}