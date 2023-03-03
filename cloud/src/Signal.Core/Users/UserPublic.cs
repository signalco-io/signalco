namespace Signal.Core.Users;

public class UserPublic : IUserPublic
{
    public UserPublic(string userId, string email, string? fullName)
    {
        this.UserId = userId;
        this.Email = email;
        this.FullName = fullName;
    }

    public string UserId { get; }
    public string Email { get; }
    public string? FullName { get; }
}