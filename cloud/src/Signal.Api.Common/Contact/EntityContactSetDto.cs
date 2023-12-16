using System;
using System.Text.Json.Serialization;

namespace Signal.Api.Common.Contact;

[Serializable]
public class EntityContactSetDto
{

    [JsonPropertyName("valueSerialized")]
    public string? ValueSerialized { get; set; }

    [JsonPropertyName("timeStamp")]
    public DateTime? TimeStamp { get; set; }
}