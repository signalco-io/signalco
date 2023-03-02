namespace Signal.Beacon.Core.Entity;

public record ContactPointer(string EntityId, string ChannelName, string ContactName) : IContactPointer
{
    public override string ToString() => $"{this.EntityId} {this.ChannelName} {this.ContactName}";
}