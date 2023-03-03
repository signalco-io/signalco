namespace Signal.Core.Contacts;

public record ContactPointer(string EntityId, string ChannelName, string ContactName) : IContactPointer
{
    public static explicit operator ContactPointer(string value)
    {
        var splitValues = value.Split("-");
        return new ContactPointer(
            $"{splitValues[0]}-{splitValues[1]}-{splitValues[2]}-{splitValues[3]}-{splitValues[4]}", 
            splitValues[5],
            string.Join("-", splitValues[6..]));
    }

    public override string ToString() => $"{this.EntityId}-{this.ChannelName}-{this.ContactName}";
}
