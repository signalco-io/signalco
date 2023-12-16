using System;
using System.Text.Json.Serialization;

namespace Signal.Api.Common.Entities;

[Serializable]
public class EntityDto(string id, string alias)
{
    [JsonPropertyName("id")]
    public string Id { get; } = id;

    [JsonPropertyName("alias")]
    public string Alias { get; } = alias;
}