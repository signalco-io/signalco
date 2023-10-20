using System.Text.Json.Serialization;

namespace Signalco.Station.Channel.Shelly;

internal class Shelly3emStatusDto
{
    [JsonPropertyName("relays")] public List<Relay>? Relays { get; set; }

    [JsonPropertyName("emeters")] public List<Emeter>? Emeters { get; set; }

    [JsonPropertyName("total_power")] public double? TotalPower { get; set; }

    [JsonPropertyName("fs_mounted")] public bool? FsMounted { get; set; }

    public class Emeter
    {
        [JsonPropertyName("power")] public double Power { get; set; }

        [JsonPropertyName("pf")] public double Pf { get; set; }

        [JsonPropertyName("current")] public double Current { get; set; }

        [JsonPropertyName("voltage")] public double Voltage { get; set; }

        [JsonPropertyName("is_valid")] public bool IsValid { get; set; }

        [JsonPropertyName("total")] public double Total { get; set; }

        [JsonPropertyName("total_returned")] public double TotalReturned { get; set; }
    }

    public class Relay
    {
        [JsonPropertyName("ison")] public bool Ison { get; set; }

        [JsonPropertyName("has_timer")] public bool HasTimer { get; set; }

        [JsonPropertyName("timer_started")] public int TimerStarted { get; set; }

        [JsonPropertyName("timer_duration")] public int TimerDuration { get; set; }

        [JsonPropertyName("timer_remaining")] public int TimerRemaining { get; set; }

        [JsonPropertyName("overpower")] public bool Overpower { get; set; }

        [JsonPropertyName("is_valid")] public bool IsValid { get; set; }

        [JsonPropertyName("source")] public string Source { get; set; }
    }
}