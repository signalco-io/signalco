using System;

namespace Signal.Core.Auth;

public class Pat : IPat
{
    public required string UserId { get; set; }
    public required string PatEnd { get; set; }
    public required string PatHash { get; set; }
    public string? Alias { get; set; }
    public DateTime? Expire { get; set; }
}

public interface IPat
{
    string UserId { get; set; }

    string PatEnd { get; set; }

    string PatHash { get; set; }

    string? Alias { get; set; }

    DateTime? Expire { get; set; }
}