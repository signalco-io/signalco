using System;

namespace Signal.Core.Contacts;

public class Contact : IContact
{
    public Contact(
        string entityId,
        string channelName,
        string contactName,
        string? valueSerialized,
        DateTime timeStamp,
        string? metadata)
    {
        this.EntityId = entityId;
        this.ChannelName = channelName;
        this.ContactName = contactName;
        this.ValueSerialized = valueSerialized;
        this.TimeStamp = timeStamp;
        this.Metadata = metadata;
    }

    public string EntityId { get; }

    public string ChannelName { get; }

    public string ContactName { get; }

    public string? ValueSerialized { get; }

    public DateTime TimeStamp { get; }

    public string? Metadata { get; }
}