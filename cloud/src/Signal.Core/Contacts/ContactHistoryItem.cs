using System;

namespace Signal.Core.Contacts;

public class ContactHistoryItem(
        IContactPointer contactPointer,
        string? valueSerialized,
        DateTime timeStamp)
    : IContactHistoryItem
{
    public IContactPointer ContactPointer { get; } = contactPointer;

    public string? ValueSerialized { get; } = valueSerialized;

    public DateTime Timestamp { get; } = timeStamp;
}