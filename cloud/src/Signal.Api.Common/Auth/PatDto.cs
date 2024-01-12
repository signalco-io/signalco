using System;
using System.Text.Json.Serialization;

namespace Signal.Api.Common.Auth;

[Serializable]
public sealed class PatDto(string userId, string patEnd, string? alias, DateTime? expire)
{
    [JsonPropertyName("userId")]
    public string UserId { get; } = userId;
    
    [JsonPropertyName("patEnd")]
    public string PatEnd { get; } = patEnd;

    [JsonPropertyName("alias")]
    public string? Alias { get; } = alias;

    [JsonPropertyName("expire")]
    public DateTime? Expire { get; } = expire;
}