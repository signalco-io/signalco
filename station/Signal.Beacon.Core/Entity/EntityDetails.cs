using System;
using System.Collections.Generic;
using System.Linq;

namespace Signal.Beacon.Core.Entity;

public class EntityDetails : IEntityDetails
{
    public EntityType Type { get; }

    public string Id { get; }

    public string Alias { get; }

    public IEnumerable<IContact> Contacts { get; }
    
    public EntityDetails(EntityType type, string id, string alias, IEnumerable<IContact>? contacts = null)
    {
        this.Type = type;
        this.Id = id ?? throw new ArgumentNullException(nameof(id));
        this.Alias = alias ?? throw new ArgumentNullException(nameof(alias));
        this.Contacts = contacts ?? Enumerable.Empty<IContact>();
    }

    public IContact? Contact(IContactPointer pointer) =>
        pointer.EntityId != this.Id 
            ? null 
            : this.Contacts.FirstOrDefault(c => c.ChannelName == pointer.ChannelName && c.ContactName == pointer.ContactName);

    public IContact? Contact(string channelName, string contactName) =>
        this.Contacts.FirstOrDefault(c => c.ChannelName == channelName && c.ContactName == contactName);

    public IContact ContactOrDefault(string channelName, string contactName) =>
        this.Contact(channelName, contactName) ?? new Contact(this.Id, channelName, contactName);

    public IContact ContactOrDefault(IContactPointer pointer) => 
        this.ContactOrDefault(pointer.ChannelName, pointer.ContactName);
}