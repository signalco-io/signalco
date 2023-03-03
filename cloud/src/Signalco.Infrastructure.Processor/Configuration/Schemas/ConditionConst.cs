using System.Text.Json.Serialization;

namespace Signalco.Infrastructure.Processor.Configuration.Schemas;

[Serializable]
public record ConditionConst : Condition
{
    [JsonPropertyName("valueSerialized")] 
    public string? ValueSerialized { get; set; }
}