using System;
using Signal.Core.Users;

namespace Signal.Infrastructure.AzureStorage.Tables;

[Serializable]
internal class AzureUser : AzureTableEntityBase
{
    public string Email { get; set; }

    public string? FullName { get; set; }

    public AzureUser() : base(string.Empty, string.Empty)
    {
    }

    protected AzureUser(string source, string id) : base(source, id)
    {
    }

    public static AzureUser From(IUser user) =>
        new(user.Source, user.UserId)
        {
            Email = user.Email,
            FullName = user.FullName
        };

    public static IUser ToUser(AzureUser user) => 
        new User(user.PartitionKey, user.RowKey, user.Email, user.FullName);
}