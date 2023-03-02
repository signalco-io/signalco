using System;

namespace Signal.Beacon.Core.Entity;

public class Contact : IContact
{
    public Contact(string entityId, string channelName, string contactName, string? valueSerialized = null, DateTime? timeStamp = null)
    {
        this.EntityId = entityId;
        this.ChannelName = channelName;
        this.ContactName = contactName;
        this.ValueSerialized = valueSerialized;
        this.TimeStamp = timeStamp;
    }

    public string EntityId { get; init; }

    public string ChannelName { get; init; }

    public string ContactName { get; init; }

    public string? ValueSerialized { get; private set; }

    public DateTime? TimeStamp { get; private set; }

    public IContactPointer Pointer => new ContactPointer(this.EntityId, this.ChannelName, this.ContactName);

    public void UpdateLocalValue(string? valueSerialized, DateTime? timeStamp = null)
    {
        this.ValueSerialized = valueSerialized;
        this.TimeStamp = timeStamp;
    }
}