using Signal.Core.Contacts;

namespace Signal.Core.Processor;

public interface IContactLinkProcessTriggerItem
{
    IContactPointer ContactPointer { get; set; }

    string ProcessEntityId { get; set; }
}