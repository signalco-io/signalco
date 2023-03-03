using System;
using System.Text.Json.Serialization;

namespace Signal.Api.Common.Contact;

[Serializable]
public class ContactSetDto
{
    [JsonPropertyName("entityId")]
    public string? EntityId { get; set; }

    [JsonPropertyName("channelName")]
    public string? ChannelName { get; set; }

    [JsonPropertyName("contactName")]
    public string? ContactName { get; set; }

    [JsonPropertyName("valueSerialized")]
    public string? ValueSerialized { get; set; }

    [JsonPropertyName("timeStamp")]
    public DateTime? TimeStamp { get; set; }
}