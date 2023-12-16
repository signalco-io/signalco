using System;

namespace Signal.Core.Contacts;

public class Contact(
        string entityId,
        string channelName,
        string contactName,
        string? valueSerialized,
        DateTime timeStamp,
        string? metadata)
    : IContact
{
    public string EntityId { get; } = entityId;

    public string ChannelName { get; } = channelName;

    public string ContactName { get; } = contactName;

    public string? ValueSerialized { get; } = valueSerialized;

    public DateTime TimeStamp { get; } = timeStamp;

    public string? Metadata { get; } = metadata;
}