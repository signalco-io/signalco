using System.Text.Json;

namespace Signal.Core.Storage;

public static class IQueueItemExtensions
{
    private static readonly JsonSerializerOptions caseInsensitiveOptions = new() {PropertyNameCaseInsensitive = true};

    public static T? ToQueueItem<T>(this string @data)
        where T : class =>
        JsonSerializer.Deserialize<T>(@data, caseInsensitiveOptions);
}