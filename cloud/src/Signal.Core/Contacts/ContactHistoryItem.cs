using System;

namespace Signal.Core.Contacts;

public class ContactHistoryItem : IContactHistoryItem
{
    public ContactHistoryItem(
        IContactPointer contactPointer,
        string? valueSerialized,
        DateTime timeStamp)
    {
        this.ContactPointer = contactPointer;
        this.ValueSerialized = valueSerialized;
        this.Timestamp = timeStamp;
    }

    public IContactPointer ContactPointer { get; }

    public string? ValueSerialized { get; }

    public DateTime Timestamp { get; }
}