using System;

namespace Signal.Infrastructure.AzureStorage.Tables;

[Serializable]
internal class AzureNewsletterSubscription : AzureTableEntityBase
{
    public string Email { get; set; }

    public AzureNewsletterSubscription(string email) : base("email", Guid.NewGuid().ToString())
    {
        this.Email = email;
    }
}