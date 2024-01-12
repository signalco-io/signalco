using System;

namespace Signal.Core.Auth;

public record PatCreate(string UserId, string? Alias, DateTime? Expire) : IPatCreate;