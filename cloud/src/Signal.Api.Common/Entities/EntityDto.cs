using System;
using System.Text.Json.Serialization;

namespace Signal.Api.Common.Entities;

[Serializable]
public class EntityDto
{
    public EntityDto(string id, string alias)
    {
        this.Id = id;
        this.Alias = alias;
    }

    [JsonPropertyName("id")]
    public string Id { get; }

    [JsonPropertyName("alias")]
    public string Alias { get; }
}