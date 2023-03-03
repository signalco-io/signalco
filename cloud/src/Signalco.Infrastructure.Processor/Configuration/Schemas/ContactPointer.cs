using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Signalco.Infrastructure.Processor.Configuration.Schemas;

[Serializable]
public record ContactPointer
{
    [JsonPropertyName("entityId")]
    [JsonIgnore(Condition = JsonIgnoreCondition.Never)]   
    [Required(AllowEmptyStrings = true)]
    [RegularExpression(@"^[0-9a-fA-F]{8}-([0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}$")]
    public string? EntityId { get; set; }

    [JsonPropertyName("channelName")]
    [JsonIgnore(Condition = JsonIgnoreCondition.Never)]   
    [Required(AllowEmptyStrings = true)]
    [RegularExpression(@"^[0-9a-zA-Z]+$")]
    public string? ChannelName { get; set; }

    [JsonPropertyName("contactName")]
    [JsonIgnore(Condition = JsonIgnoreCondition.Never)]   
    [Required(AllowEmptyStrings = true)]
    public string? ContactName { get; set; }
}