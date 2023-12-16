using System;
using System.Text.Json.Serialization;

namespace Signal.Core.Contacts;

[Serializable]
public class ContactDto(
    string entityId, 
    string contactName, 
    string channelName, 
    string? valueSerialized, 
    DateTime timeStamp, 
    string? metadata)
{
    [JsonPropertyName("entityId")]
    public string EntityId { get; } = entityId;

    [JsonPropertyName("contactName")]
    public string ContactName { get; } = contactName;

    [JsonPropertyName("channelName")]
    public string ChannelName { get; } = channelName;

    [JsonPropertyName("valueSerialized")]
    public string? ValueSerialized { get; } = valueSerialized;

    [JsonPropertyName("timeStamp")]
    public DateTime TimeStamp { get; } = timeStamp;

    [JsonPropertyName("metadata")]
    public string? Metadata { get; } = metadata;
}