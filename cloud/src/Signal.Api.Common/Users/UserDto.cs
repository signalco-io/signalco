using System;
using System.Text.Json.Serialization;

namespace Signal.Api.Common.Users;

[Serializable]
public class UserDto(string id, string email, string? fullName)
{
    [JsonPropertyName("id")]
    public string Id { get; } = id;

    [JsonPropertyName("email")]
    public string Email { get; } = email;

    [JsonPropertyName("fullName")]
    public string? FullName { get; } = fullName;
}