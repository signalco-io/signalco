using System;
using System.Text.Json.Serialization;

namespace Signal.Beacon.Application.Signal.Client.Contact;

[Serializable]
internal class SignalcoContactDto
{
    [JsonPropertyName("entityId")]
    public string? EntityId { get; set; }

    [JsonPropertyName("contactName")]
    public string? ContactName { get; set; }

    [JsonPropertyName("channelName")]
    public string? ChannelChannel { get; set; }

    [JsonPropertyName("valueSerialized")]
    public string? ValueSerialized { get; set; }

    [JsonPropertyName("timeStamp")]
    public DateTime? TimeStamp { get; set; }
}

[Serializable]
internal record SignalcoContactUpsertDto(
    [property: JsonPropertyName("entityId")] string EntityId,
    [property: JsonPropertyName("channelName")] string ChannelName,
    [property: JsonPropertyName("contactName")] string ContactName,
    [property: JsonPropertyName("valueSerialized")] string? ValueSerialized,
    [property: JsonPropertyName("timeStamp")] DateTime? TimeStamp);