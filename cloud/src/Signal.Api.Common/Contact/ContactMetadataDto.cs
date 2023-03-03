using System;
using System.Text.Json.Serialization;

namespace Signal.Api.Common.Contact;

[Serializable]
public class ContactMetadataDto
{
    [JsonPropertyName("entityId")]
    public string? EntityId { get; set; }

    [JsonPropertyName("channelName")]
    public string? ChannelName { get; set; }

    [JsonPropertyName("contactName")]
    public string? ContactName { get; set; }

    [JsonPropertyName("metadata")]
    public string? Metadata { get; set; }
}