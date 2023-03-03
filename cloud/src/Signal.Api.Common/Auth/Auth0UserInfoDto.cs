using System;
using Newtonsoft.Json;

namespace Signal.Api.Common.Auth;

public class Auth0UserInfoDto
{
    [JsonProperty("sub")]
    public string? Sub { get; set; }

    [JsonProperty("given_name")]
    public string? GivenName { get; set; }

    [JsonProperty("family_name")]
    public string? FamilyName { get; set; }

    [JsonProperty("nickname")]
    public string? Nickname { get; set; }

    [JsonProperty("name")]
    public string? Name { get; set; }

    [JsonProperty("picture")]
    public string? Picture { get; set; }

    [JsonProperty("locale")]
    public string? Locale { get; set; }

    [JsonProperty("updated_at")]
    public DateTime? UpdatedAt { get; set; }

    [JsonProperty("email")]
    public string? Email { get; set; }

    [JsonProperty("email_verified")]
    public bool? EmailVerified { get; set; }
}