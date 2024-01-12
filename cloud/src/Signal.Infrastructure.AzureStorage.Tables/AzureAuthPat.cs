﻿using System;
using Signal.Core.Auth;

namespace Signal.Infrastructure.AzureStorage.Tables;

[Serializable]
internal class AzureAuthPat : AzureTableEntityBase
{
    public string PatEnd { get; }
    public string? Alias { get; }
    public DateTime? Expire { get; }

    public AzureAuthPat(string userId, string patHash, string patEnd, string? alias, DateTime? expire)
        : this(userId, patHash)
    {
        this.PatEnd = patEnd;
        this.Alias = alias;
        this.Expire = expire;
    }

    private AzureAuthPat(string partitionKey, string rowKey) : base(partitionKey, rowKey)
    {
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