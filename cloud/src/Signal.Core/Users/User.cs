namespace Signal.Core.Users;

public class User : IUser
{
    public User(string source, string userId, string email, string? fullName)
    {
        this.Source = source;
        this.UserId = userId;
        this.Email = email;
        this.FullName = fullName;
    }

    public string Source { get; }

    public string UserId { get; }
    
    public string Email { get; }
    
    public string? FullName { get; }
}