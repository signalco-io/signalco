using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Signal.Beacon.Channel.Tasmota;

public class TasmotaConfig
{
    [JsonPropertyName("dn")]
    public string? DeviceName { get; set; }

    [JsonPropertyName("t")]
    public string? Topic { get; set; }

    [JsonPropertyName("ft")]
    public string? FullTopic { get; set; }

    [JsonPropertyName("tp")]
    public List<string>? TopicPrefixes { get; set; }
}