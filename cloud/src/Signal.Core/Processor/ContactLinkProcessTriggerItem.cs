using System;
using Signal.Core.Contacts;

namespace Signal.Core.Processor;

public class ContactLinkProcessTriggerItem(
    IContactPointer contact,
    string processEntityId) 
    : IContactLinkProcessTriggerItem
{
    public IContactPointer ContactPointer { get; set; } = contact ?? throw new ArgumentNullException(nameof(contact));
    public string ProcessEntityId { get; set; } = processEntityId ?? throw new ArgumentNullException(nameof(processEntityId));
}