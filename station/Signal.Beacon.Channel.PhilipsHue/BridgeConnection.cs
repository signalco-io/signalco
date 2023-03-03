using System;
using HueApi;

namespace Signal.Beacon.Channel.PhilipsHue;

internal class BridgeConnection
{
    public BridgeConnection(BridgeConfig config, LocalHueApi localClient)
    {
        this.Config = config;
        this.LocalClient = localClient;
    }

    public BridgeConfig Config { get; }

    public LocalHueApi LocalClient { get; private set; }

    public void AssignNewClient(LocalHueApi client)
    {
        this.LocalClient = client ?? throw new ArgumentNullException(nameof(client));
    }
}