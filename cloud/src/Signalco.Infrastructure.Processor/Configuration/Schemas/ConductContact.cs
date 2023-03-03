using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Signalco.Infrastructure.Processor.Configuration.Schemas;

[Serializable]
public record ConductContact
{
    [JsonPropertyName("contactPointer")]
    [JsonIgnore(Condition = JsonIgnoreCondition.Never)]
    [Required]
    public ContactPointer? ContactPointer { get; set; }

    [JsonPropertyName("valueSerialized")]
    public string? ValueSerialized { get; set; }
}