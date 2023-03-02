using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Signal.Beacon.Channel.Signal;

[Serializable]
internal class SignalDeviceConfig
{
    [JsonPropertyName("api")]
    public string? Api { get; set; }

    [JsonPropertyName("v")]
    public string? Version { get; set; }

    [JsonPropertyName("time")]
    public string? Time { get; set; }

    [JsonPropertyName("epoch")]
    public int? Epoch { get; set; }

    [JsonPropertyName("wifiIp")]
    public string? WifiIp { get; set; }

    [JsonPropertyName("wifiAlive")]
    public bool? WifiAlive { get; set; }

    [JsonPropertyName("wifiSsid")]
    public string? WifiSsid { get; set; }

    [JsonPropertyName("wifiHostname")]
    public string? WifiHostname { get; set; }

    [JsonPropertyName("mqttAlive")]
    public bool? MqttAlive { get; set; }

    [JsonPropertyName("mqttAddress")]
    public string? MqttAddress { get; set; }

    [JsonPropertyName("mqttTopic")]
    public string? MqttTopic { get; set; }

    [JsonPropertyName("alias")]
    public string? Alias { get; set; }

    [JsonPropertyName("contacts")]
    public List<Contact>? Contacts { get; set; }

    [Serializable]
    public class Contact
    {
        //[JsonPropertyName("access")]
        //public DeviceContactAccess? Access { get; set; }

        [JsonPropertyName("dataType")]
        public string? DataType { get; set; }

        [JsonPropertyName("name")]
        public string? Name { get; set; }
    }
}