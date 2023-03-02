using Signal.Beacon.Application.Auth;

namespace Signal.Beacon.Application.Signal.Station;

public class StationConfiguration
{
    public string? Id { get; set; }

    public AuthToken? Token { get; set; }
}