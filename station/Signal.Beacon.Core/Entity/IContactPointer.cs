namespace Signal.Beacon.Core.Entity;

public interface IContactPointer
{
    string EntityId { get; init; }
    string ChannelName { get; init; }
    string ContactName { get; init; }
}