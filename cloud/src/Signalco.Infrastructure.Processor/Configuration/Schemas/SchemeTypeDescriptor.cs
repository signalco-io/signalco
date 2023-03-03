using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Signalco.Infrastructure.Processor.Configuration.Schemas;

[Serializable]
public abstract record SchemeTypeDescriptor
{
    [Required(AllowEmptyStrings = false)]
    [JsonPropertyName("type")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Type { get; set; }
}