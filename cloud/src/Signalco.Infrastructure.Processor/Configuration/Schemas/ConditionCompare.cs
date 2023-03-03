using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Signalco.Infrastructure.Processor.Configuration.Schemas;

[Serializable]
public record ConditionCompare : Condition
{
    [JsonPropertyName("op")] 
    public CompareOperation Operation { get; set; }

    [Required]
    [JsonPropertyName("left")]
    [JsonConverter(typeof(JsonConditionConverter))]
    public Condition? Left { get; set; }

    [Required]
    [JsonPropertyName("right")]
    [JsonConverter(typeof(JsonConditionConverter))]
    public Condition? Right { get; set; }
}