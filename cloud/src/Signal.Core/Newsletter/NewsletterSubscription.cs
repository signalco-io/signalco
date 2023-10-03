namespace Signal.Core.Newsletter;

public class NewsletterSubscription(string email) : INewsletterSubscription
{
    public string Email { get; set; } = email;
}