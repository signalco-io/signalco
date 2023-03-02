using System.Text.Json.Serialization;

namespace Signal.Beacon.Channel.Tasmota;

public class TasmotaSensorTelemetryAnalog
{
    [JsonPropertyName("A0")]
    public int? A0 { get; set; }
}