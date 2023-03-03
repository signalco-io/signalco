namespace Signal.Core.Newsletter;

public class NewsletterSubscription : INewsletterSubscription
{
    public NewsletterSubscription(string email)
    {
        this.Email = email;
    }

    public string Email { get; set; }
}