using System.Text.Json;
using System.Text.Json.Serialization;

namespace Signalco.Infrastructure.Processor.Configuration.Schemas;

public abstract class JsonTypeFactoryConverter<T> : JsonConverter<T> where T : class
{
    protected abstract IReadOnlyDictionary<string, Type> Map { get; }

    public override T Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        var tmpReader = reader;
        var conduct = JsonSerializer.Deserialize<TypeDescriptor>(ref tmpReader, options);
        if (!this.Map.TryGetValue(conduct?.Type ?? throw new InvalidDataException("Missing type"), out var type))
            throw new NotSupportedException("Unknown type");

        return JsonSerializer.Deserialize(ref reader, type, options) as T
               ?? throw new InvalidDataException($"Unable to deserialize configuration for {type.Name}.");
    }

    public override void Write(Utf8JsonWriter writer, T value, JsonSerializerOptions options) =>
        JsonSerializer.Serialize<object>(writer, value, options);
}