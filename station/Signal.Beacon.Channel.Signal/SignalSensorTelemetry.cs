using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Signal.Beacon.Channel.Signal;

[Serializable]
internal class SignalSensorTelemetryDto
{
    [JsonPropertyName("contacts")]
    public IEnumerable<ValueDto>? Contacts { get; set; }

    [Serializable]
    public class ValueDto
    {
        [JsonPropertyName("contact")]
        public string? ContactName { get; set; }

        [JsonPropertyName("value")]
        public object? Value { get; set; }
    }
}