using System;
using System.Text.Json.Serialization;

namespace Signal.Api.Common.Users;

[Serializable]
public class UserDto
{
    public UserDto(string id, string email, string? fullName)
    {
        this.Id = id;
        this.Email = email;
        this.FullName = fullName;
    }

    [JsonPropertyName("id")]
    public string Id { get; }

    [JsonPropertyName("email")]
    public string Email { get; }

    [JsonPropertyName("fullName")]
    public string? FullName { get; }
}