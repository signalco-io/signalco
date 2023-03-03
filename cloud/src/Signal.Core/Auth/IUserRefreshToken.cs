using System;

namespace Signal.Core.Auth;

public interface IUserRefreshToken
{
    string AccessToken { get; }

    DateTime Expire { get; }
}