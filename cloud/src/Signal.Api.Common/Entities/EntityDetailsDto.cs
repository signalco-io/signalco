using Signal.Api.Common.Users;
using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;
using Signal.Core.Entities;
using Signal.Core.Contacts;

namespace Signal.Api.Common.Entities
{
    [Serializable]
    public class EntityDetailsDto
    {
        public EntityDetailsDto(EntityType type, string id, string alias)
        {
            this.Type = type;
            this.Id = id;
            this.Alias = alias;
        }

        [JsonPropertyName("type")]
        public EntityType Type { get; }

        [JsonPropertyName("id")]
        public string Id { get; }

        [JsonPropertyName("alias")]
        public string Alias { get; }

        [JsonPropertyName("contacts")]
        public IEnumerable<ContactDto>? Contacts { get; set; }

        [JsonPropertyName("sharedWith")]
        public IEnumerable<UserDto>? SharedWith { get; set; }
    }
}
