namespace Signal.Core.Users;

public class UserPublic(string userId, string email, string? fullName) : IUserPublic
{
    public string UserId { get; } = userId;
    public string Email { get; } = email;
    public string? FullName { get; } = fullName;
}