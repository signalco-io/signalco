using System;

namespace Signal.Beacon.Channel.PhilipsHue;

internal class PhilipsHueLight
{
    public PhilipsHueLight(string entityId, Guid uniqueId, string id, string bridgeId, PhilipsHueLightState state)
    {
        this.EntityId = entityId;
        this.Id = uniqueId;
        this.BridgeId = bridgeId;
        this.State = state;
    }

    public string EntityId { get; }

    public Guid Id { get; }

    public string BridgeId { get; }

    public PhilipsHueLightState State { get; }

    public record PhilipsHueLightState(bool On, double? Temperature, double? Brightness);
}