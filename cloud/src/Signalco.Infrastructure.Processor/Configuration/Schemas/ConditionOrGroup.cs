using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Signalco.Infrastructure.Processor.Configuration.Schemas;

[Serializable]
public record ConditionOrGroup : Condition
{
    [Required]
    [JsonPropertyName("conditions")]
    [JsonConverter(typeof(JsonConditionsConverter))]
    public ICollection<Condition>? Conditions { get; set; }
}