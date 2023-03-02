using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Signal.Beacon.Application.Signal.Client.Station;

public record SignalcoStationRefreshTokenRequestDto(
    [property: JsonPropertyName("refreshToken")] string RefreshToken);

public record SignalcoStationRefreshTokenResponseDto(
    [property: JsonPropertyName("accessToken")] string AccessToken,
    [property: JsonPropertyName("expire")] DateTime Expire);

public record SignalcoLoggingStationRequestDto(
    [property: JsonPropertyName("stationId")] string StationId,
    [property: JsonPropertyName("entries")] IEnumerable<SignalcoLoggingStationEntryDto> Entries);

public record SignalcoLoggingStationEntryDto(
    [property: JsonPropertyName("t")] DateTimeOffset T,
    [property: JsonPropertyName("l")] int L,
    [property: JsonPropertyName("m")] string M);