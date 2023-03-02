using System;

namespace Signal.Beacon.Application.Auth;

public class AuthToken
{
    public AuthToken(string accessToken, string refreshToken, DateTime expire)
    {
        this.AccessToken = accessToken;
        this.RefreshToken = refreshToken;
        this.Expire = expire;
    }

    public string AccessToken { get; }

    public string RefreshToken { get; }

    public DateTime Expire { get; }
}