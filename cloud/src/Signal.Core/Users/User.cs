namespace Signal.Core.Users;

public class User(string source, string userId, string email, string? fullName)
    : IUser
{
    public string Source { get; } = source;

    public string UserId { get; } = userId;

    public string Email { get; } = email;

    public string? FullName { get; } = fullName;
}