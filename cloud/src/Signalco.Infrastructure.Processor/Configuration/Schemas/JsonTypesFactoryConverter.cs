using System.Text.Json;
using System.Text.Json.Serialization;

namespace Signalco.Infrastructure.Processor.Configuration.Schemas;

public abstract class JsonTypesFactoryConverter<T> : JsonConverter<ICollection<T>> where T : class
{
    protected abstract IReadOnlyDictionary<string, Type> Map { get; }

    public override ICollection<T> Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        var conducts = new List<T>();

        do
        {
            if (reader.TokenType == JsonTokenType.StartArray) continue;
            if (reader.TokenType == JsonTokenType.EndArray) break;

            var tmpReader = reader;
            var conduct = JsonSerializer.Deserialize<TypeDescriptor>(ref tmpReader, options);
            if (!this.Map.TryGetValue(conduct?.Type ?? throw new InvalidDataException("Missing type"), out var type))
                throw new NotSupportedException("Unknown type");

            conducts.Add(JsonSerializer.Deserialize(ref reader, type, options) as T
                         ?? throw new InvalidDataException($"Unable to deserialize configuration for {type.Name}."));
        } while (reader.Read());

        return conducts;
    }

    public override void Write(Utf8JsonWriter writer, ICollection<T> value, JsonSerializerOptions options)
    {
        writer.WriteStartArray();
        foreach (var v in value) 
            JsonSerializer.Serialize<object>(writer, v, options);
        writer.WriteEndArray();
    }
}