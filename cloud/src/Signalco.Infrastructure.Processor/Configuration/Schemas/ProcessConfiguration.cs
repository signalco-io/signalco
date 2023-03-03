using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Signalco.Infrastructure.Processor.Configuration.Schemas;

[Serializable]
public record ProcessConfiguration
{
    [JsonPropertyName("$schema")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]   
    public string? Schema { get; set; }
        
    /// <summary>
    /// Type of the process configuration.
    /// </summary>
    [JsonPropertyName("type")]
    [JsonIgnore(Condition = JsonIgnoreCondition.Never)]   
    public ProcessType Type { get; set; }

    /// <summary>
    /// List of conducts to execute.
    /// </summary>
    [JsonPropertyName("conducts")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]   
    [MinLength(1)]
    [Required]
    [JsonConverter(typeof(JsonConductConverter))]
    public ICollection<Conduct>? Conducts { get; set; }
}