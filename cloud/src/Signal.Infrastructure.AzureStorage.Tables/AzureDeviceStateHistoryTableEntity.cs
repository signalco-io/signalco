using System;
using Signal.Core.Contacts;

namespace Signal.Infrastructure.AzureStorage.Tables;

internal class AzureContactHistoryItem : AzureTableEntityBase
{
    public string? ValueSerialized { get; set; }

    public AzureContactHistoryItem() : base(string.Empty, string.Empty)
    {
    }

    protected AzureContactHistoryItem(string partitionKey, string rowKey) : base(partitionKey, rowKey)
    {
    }

    public static AzureContactHistoryItem From(IContactHistoryItem item)
    {
        return new AzureContactHistoryItem(
            item.ContactPointer.ToString(),
            $"{DateTime.MaxValue.Ticks - item.Timestamp.Ticks:D19}")
        {
            ValueSerialized = item.ValueSerialized
        };
    }

    public static IContactHistoryItem To(AzureContactHistoryItem item)
    {
        return new ContactHistoryItem(
            (ContactPointer) item.PartitionKey, 
            item.ValueSerialized,
            new DateTime(DateTime.MaxValue.Ticks - long.Parse(item.RowKey), DateTimeKind.Utc));
    }
}