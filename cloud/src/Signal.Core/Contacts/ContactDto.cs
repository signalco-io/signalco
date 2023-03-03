using System;
using System.Text.Json.Serialization;

namespace Signal.Core.Contacts;

[Serializable]
public class ContactDto
{
    public ContactDto(string entityId, string contactName, string channelName, string? valueSerialized, DateTime timeStamp, string? metadata)
    {
        this.EntityId = entityId;
        this.ContactName = contactName;
        this.ChannelName = channelName;
        this.ValueSerialized = valueSerialized;
        this.TimeStamp = timeStamp;
        this.Metadata = metadata;
    }

    [JsonPropertyName("entityId")]
    public string EntityId { get; }

    [JsonPropertyName("contactName")]
    public string ContactName { get; }

    [JsonPropertyName("channelName")]
    public string ChannelName { get; }

    [JsonPropertyName("valueSerialized")]
    public string? ValueSerialized { get; }

    [JsonPropertyName("timeStamp")]
    public DateTime TimeStamp { get; }

    [JsonPropertyName("metadata")]
    public string? Metadata { get; }
}