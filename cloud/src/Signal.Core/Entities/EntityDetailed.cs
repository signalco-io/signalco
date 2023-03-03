using System;
using System.Collections.Generic;
using Signal.Core.Contacts;
using Signal.Core.Users;

namespace Signal.Core.Entities;

public class EntityDetailed : Entity, IEntityDetailed
{
    public EntityDetailed(EntityType type, string id, string? alias, IEnumerable<IContact> contacts, IEnumerable<IUserPublic> users) : base(type, id, alias)
    {
        this.Contacts = contacts ?? throw new ArgumentNullException(nameof(contacts));
        this.Users = users ?? throw new ArgumentNullException(nameof(users));
    }

    public IEnumerable<IContact> Contacts { get; }
    public IEnumerable<IUserPublic> Users { get; }
}