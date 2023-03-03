using System;
using Signal.Core.Contacts;

namespace Signal.Core.Processor;

public class ContactLinkProcessTriggerItem : IContactLinkProcessTriggerItem
{
    public ContactLinkProcessTriggerItem(
        IContactPointer contact,
        string processEntityId)
    {
        this.ContactPointer = contact ?? throw new ArgumentNullException(nameof(contact));
        this.ProcessEntityId = processEntityId ?? throw new ArgumentNullException(nameof(processEntityId));
    }

    public IContactPointer ContactPointer { get; set; }
    public string ProcessEntityId { get; set; }
}