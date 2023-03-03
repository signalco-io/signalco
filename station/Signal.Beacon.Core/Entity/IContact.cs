using System;

namespace Signal.Beacon.Core.Entity;

public interface IContact
{
    string EntityId { get; init; }
    string ChannelName { get; init; }
    string ContactName { get; init; }

    string? ValueSerialized { get; }
    
    DateTime? TimeStamp { get; }

    IContactPointer Pointer { get; }
    void UpdateLocalValue(string? valueSerialized, DateTime? timeStamp = null);
}