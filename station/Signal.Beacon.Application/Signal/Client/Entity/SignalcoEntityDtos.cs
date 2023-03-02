using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;
using Signal.Beacon.Application.Signal.Client.Contact;
using Signal.Beacon.Core.Entity;

namespace Signal.Beacon.Application.Signal.Client.Entity;

[Serializable]
internal record SignalcoEntityDeleteRequestDto(
    [property: JsonPropertyName("id")] string? Id);

[Serializable]
internal record SignalcoEntityUpsertDto(
    [property: JsonPropertyName("id")] string? Id,
    [property: JsonPropertyName("type")] EntityType? Type,
    [property: JsonPropertyName("alias")] string Alias);

[Serializable]
internal record SignalcoEntityUpsertResponseDto(
    [property: JsonPropertyName("id")] string? Id);

[Serializable]
internal class SignalcoEntityDetailsDto
{
    [JsonPropertyName("type")]
    public EntityType? Type { get; set; }

    [JsonPropertyName("id")]
    public string? Id { get; set; }

    [JsonPropertyName("alias")]
    public string? Alias { get; set; }

    [JsonPropertyName("contacts")]
    public List<SignalcoContactDto>? Contacts { get; set; }
}