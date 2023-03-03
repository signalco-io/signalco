namespace Signal.Core.Users;

public interface IUserPublic
{
    public string UserId { get; }

    public string Email { get; }

    public string? FullName { get; }
}