using Signal.Beacon.Core.Extensions;

namespace Signal.Beacon.Channel.PhilipsHue;

internal static class PhilipsHueColorExtensions
{
    public static int NormalizedToMirek(this double mirek, int kelvinMin, int kelvinMax)
    {
        var nMin = kelvinMin;
        var nMax = kelvinMax;
        if (nMin <= 0 && nMax >= ushort.MaxValue)
        {
            nMin = 500;
            nMax = 153;
        }

        return (int)mirek.Denormalize(nMin, nMax);
    }

    public static double? MirekToNormalized(this int? mirek, int kelvinMin, int kelvinMax)
    {
        var nMin = kelvinMin;
        var nMax = kelvinMax;
        if (nMin <= 0 && nMax >= ushort.MaxValue)
        {
            nMin = 500;
            nMax = 153;
        }

        return mirek?.Normalize(nMin, nMax);
    }
}