using System;
using Signal.Core.Contacts;

namespace Signal.Infrastructure.AzureStorage.Tables;

[Serializable]
internal class AzureContact : AzureTableEntityBase
{
    public string Name { get; set; }
        
    public string? ValueSerialized { get; set; }

    public DateTime TimeStamp { get; set; }

    public string? Metadata { get; set; }

    public AzureContact() : base(string.Empty, string.Empty)
    {
    }
    
    protected AzureContact(string partitionKey, string rowKey) : base(partitionKey, rowKey)
    {
    }

    public static AzureContact From(IContact contact)
    {
        return new AzureContact(contact.EntityId, $"{contact.ChannelName}-{contact.ContactName}")
        {
            Name = contact.ContactName,
            ValueSerialized = contact.ValueSerialized,
            TimeStamp = contact.TimeStamp,
            Metadata = contact.Metadata
        };
    }

    public static (string partitionKey, string rowKey) ToStorageIdentifier(IContactPointer contactPointer) =>
        (contactPointer.EntityId, $"{contactPointer.ChannelName}-{contactPointer.ContactName}");

    public static AzureContact From(IContactPointer contactPointer)
    {
        var (partitionKey, rowKey) = ToStorageIdentifier(contactPointer);
        return new AzureContact(partitionKey, rowKey)
        {
            Name = contactPointer.ContactName,
            TimeStamp = DateTime.UtcNow
        };
    }

    public static IContact ToContact(AzureContact contact)
    {
        var contactName = contact.Name;
        var channelName = contact.RowKey[..contact.RowKey.IndexOf("-", StringComparison.Ordinal)];
        return new Contact(
            contact.PartitionKey,
            channelName,
            contactName,
            contact.ValueSerialized, 
            contact.TimeStamp,
            contact.Metadata);
    }
}