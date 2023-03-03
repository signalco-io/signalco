using System;

namespace Signal.Core.Contacts;

public interface IContact
{
    string EntityId { get; }

    string ChannelName { get; }

    string ContactName { get; }

    string? ValueSerialized { get; }

    DateTime TimeStamp { get; }
    string? Metadata { get; }
}