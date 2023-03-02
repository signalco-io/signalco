namespace Signal.Beacon.Core.Extensions;

public static class NumberExtensions
{
    public static double Normalize(this double value, double min, double max) => 
        (value - min) / (max - min);

    public static double Normalize(this double value, int min, int max) =>
        (value - min) / (max - (double)min);

    public static double Normalize(this int value, double min, double max) =>
        (value - min) / (max - min);

    public static double Denormalize(this double value, double min, double max) =>
        min + (max - min) * value;

    public static double Denormalize(this int value, double min, double max) =>
        min + (max - min) * value;
}