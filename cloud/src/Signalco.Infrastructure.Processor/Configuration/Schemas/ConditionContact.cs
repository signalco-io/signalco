using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Signalco.Infrastructure.Processor.Configuration.Schemas;

[Serializable]
public record ConditionContact : Condition
{
    [Required]
    [JsonPropertyName("contactPointer")]
    public ContactPointer? ContactPointer { get; set; }
}