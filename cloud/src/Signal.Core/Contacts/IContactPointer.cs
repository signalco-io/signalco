namespace Signal.Core.Contacts;

public interface IContactPointer
{
    string EntityId { get; }
    string ChannelName { get; }
    string ContactName { get; }

    string ToString();
}