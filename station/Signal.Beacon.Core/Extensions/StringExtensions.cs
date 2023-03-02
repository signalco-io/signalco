namespace Signal.Beacon.Core.Extensions;

public static class StringExtensions
{
    public static string EscapeSlashes(this string @string)
    {
        return @string.Replace("/", "|");
    }

    public static string UnescapeSlashes(this string @string)
    {
        return @string.Replace("|", "/");
    }
}