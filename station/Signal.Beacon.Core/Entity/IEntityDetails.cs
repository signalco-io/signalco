using System.Collections.Generic;

namespace Signal.Beacon.Core.Entity;

public interface IEntityDetails
{
    string Id { get; }
    string Alias { get; }
    IEnumerable<IContact> Contacts { get; }
    EntityType Type { get; }

    IContact? Contact(IContactPointer pointer);
    IContact? Contact(string channelName, string contactName);
    IContact ContactOrDefault(string channelName, string contactName);
    IContact ContactOrDefault(IContactPointer pointer);
}