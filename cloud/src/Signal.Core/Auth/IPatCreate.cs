using System;

namespace Signal.Core.Auth;

public interface IPatCreate
{
    string UserId { get; }

    string? Alias { get; }

    DateTime? Expire { get; }
}