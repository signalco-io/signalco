using System;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Signal.Core.Conducts;

[Serializable]
public class ConductRequestDto
{
    [JsonPropertyName("entityId")]
    [Required]
    public string? EntityId { get; set; }

    [JsonPropertyName("channelName")]
    [Required]
    public string? ChannelName { get; set; }

    [JsonPropertyName("contactName")]
    [Required]
    public string? ContactName { get; set; }

    [JsonPropertyName("valueSerialized")]
    public string? ValueSerialized { get; set; }

    [JsonPropertyName("delay")]
    public double? Delay { get; set; }
}