namespace Signal.Core.Users;

public interface IUser
{
    public string Source { get; }

    public string UserId { get; }

    public string Email { get; }

    public string? FullName { get; }
}