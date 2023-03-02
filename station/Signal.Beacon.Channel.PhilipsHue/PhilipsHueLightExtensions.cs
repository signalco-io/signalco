using HueApi.Models;

namespace Signal.Beacon.Channel.PhilipsHue;

internal static class PhilipsHueLightExtensions
{
    public static PhilipsHueLight AsPhilipsHueLight(this Light light, string bridgeId, string entityId)
    {
        return new(entityId, light.Id, light.IdV1 ?? light.Id.ToString(), bridgeId,
            new PhilipsHueLight.PhilipsHueLightState(
                light.On.IsOn,
                light.ColorTemperature?.Mirek.MirekToNormalized(
                    light.ColorTemperature.MirekSchema.MirekMinimum,
                    light.ColorTemperature.MirekSchema.MirekMaximum),
                light.Dimming?.Brightness));
    }
}