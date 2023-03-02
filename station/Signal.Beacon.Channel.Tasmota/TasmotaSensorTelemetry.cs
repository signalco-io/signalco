using System;
using System.Text.Json.Serialization;

namespace Signal.Beacon.Channel.Tasmota;

public class TasmotaSensorTelemetry
{
    [JsonPropertyName("Time")]
    public DateTime Time { get; set; }

    [JsonPropertyName("ANALOG")]
    public TasmotaSensorTelemetryAnalog? Analog { get; set; }
}