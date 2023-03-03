using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Signalco.Infrastructure.Processor.Configuration.Schemas;

[Serializable]
public abstract record Conduct : SchemeTypeDescriptor
{
    [Required(AllowEmptyStrings = false)]
    [JsonPropertyName("id")]
    public string? Id { get; set; }

    [Required]
    [JsonPropertyName("conditions")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    [JsonConverter(typeof(JsonConditionsConverter))]
    public ICollection<Condition>? Conditions { get; set; }

    [JsonPropertyName("notBeforeConduct")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    [RegularExpression(@"^[0-9a-fA-F]{8}-([0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}$")]
    public string? NotBeforeConduct { get; set; }

    [JsonPropertyName("delayBefore")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public double? DelayBefore { get; set; }

    [JsonPropertyName("delayAfter")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public double? DelayAfter { get; set; }
}