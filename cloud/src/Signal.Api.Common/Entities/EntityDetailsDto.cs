using Signal.Api.Common.Users;
using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;
using Signal.Core.Entities;
using Signal.Core.Contacts;

namespace Signal.Api.Common.Entities;

[Serializable]
public class EntityDetailsDto(EntityType type, string id, string alias)
{
    [JsonPropertyName("type")]
    public EntityType Type { get; } = type;

    [JsonPropertyName("id")]
    public string Id { get; } = id;

    [JsonPropertyName("alias")]
    public string Alias { get; } = alias;

    [JsonPropertyName("contacts")]
    public IEnumerable<ContactDto>? Contacts { get; set; }

    [JsonPropertyName("sharedWith")]
    public IEnumerable<UserDto>? SharedWith { get; set; }
}