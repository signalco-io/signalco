using Refit;

namespace Signalco.Station.Channel.Shelly;

internal interface Shelly3emApiClient
{
    [Get("/status")]
    Task<Shelly3emStatusDto> GetStatusAsync();
}