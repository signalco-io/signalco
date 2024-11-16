using System;
using Signal.Core.Auth;

namespace Signal.Infrastructure.AzureStorage.Tables;

[Serializable]
internal class AzureAuthPat : AzureTableEntityBase
{
    public string PatEnd { get; set; }
    
    public string? Alias { get; set; }

    public DateTime? Expire { get; set; }

    [Obsolete("For serialization only.", true)]
    public AzureAuthPat() : base(string.Empty, string.Empty)
    {
        this.PatEnd = string.Empty;
    }

    protected AzureAuthPat(string partitionKey, string rowKey) : base(partitionKey, rowKey)
    {
        this.PatEnd = string.Empty;
    }

    public AzureAuthPat(string userId, string patHash, string patEnd, string? alias, DateTime? expire)
        : this(userId, patHash)
    {
        this.PatEnd = patEnd;
        this.Alias = alias;
        this.Expire = expire;
    }

    public static IPat ToPat(AzureAuthPat pat) => new Pat
    {
        UserId = pat.PartitionKey,
        PatHash = pat.RowKey,
        PatEnd = pat.PatEnd,
        Alias = pat.Alias,
        Expire = pat.Expire,
    };
}