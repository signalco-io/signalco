using System.Text.Json.Serialization;

namespace Signal.Beacon.Application.Signal.SignalR;

public class ConductRequestDto
{
    [JsonPropertyName("entityId")]
    public string? EntityId { get; set; }

    [JsonPropertyName("channelName")]
    public string? ChannelName { get; set; }

    [JsonPropertyName("contactName")]
    public string? ContactName { get; set; }

    [JsonPropertyName("valueSerialized")]
    public string? ValueSerialized { get; set; }

    [JsonPropertyName("delay")]
    public double? Delay { get; set; }
}