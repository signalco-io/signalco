using System;

namespace Signal.Beacon.Application.Signal.Client.Contact;

internal class ContactUpsertCommand
{
    public ContactUpsertCommand(string entityId, string channelName, string name, string? valueSerialized, DateTime? timeStamp = null, bool invalidateCache = true)
    {
        this.InvalidateCache = invalidateCache;
        this.EntityId = entityId;
        this.ChannelName = channelName;
        this.Name = name;
        this.ValueSerialized = valueSerialized;
        this.TimeStamp = timeStamp;
    }

    public string EntityId { get; }
    public string ChannelName { get; }
    public string Name { get; }
    public string? ValueSerialized { get; }
    public DateTime? TimeStamp { get; }
    public bool InvalidateCache { get; }
}