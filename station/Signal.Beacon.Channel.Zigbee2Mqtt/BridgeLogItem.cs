using System;
using System.Text.Json.Serialization;

namespace Signal.Beacon.Channel.Zigbee2Mqtt;

[Serializable]
internal class BridgeLogItem
{
    /// <summary>
    /// Log item level. Can be one of: 'warn' | 'debug' | 'info' | 'error'
    /// Source: https://github.com/Koenkk/zigbee2mqtt/blob/3c5854fa9f749dde071477f700c1c2461bc20e17/lib/util/logger.ts#L12
    /// </summary>
    [JsonPropertyName("level")]
    public string? Level { get; set; }
    
    [JsonPropertyName("message")]
    public string? Message { get; set; }
}