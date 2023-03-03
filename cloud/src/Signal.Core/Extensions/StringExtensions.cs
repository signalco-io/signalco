using System.IO;

namespace Signal.Core.Extensions;

public static class StringExtensions
{
    public static string SanitizeFileName(this string fileName) =>
        string.Concat(fileName.Split(Path.GetInvalidFileNameChars()));
}