using System;
using System.Collections.Generic;
using Signal.Core.Contacts;
using Signal.Core.Users;

namespace Signal.Core.Entities;

public class EntityDetailed(
        EntityType type, 
        string id, 
        string? alias, 
        IEnumerable<IContact> contacts,
        IEnumerable<IUserPublic> users)
    : Entity(type, id, alias), IEntityDetailed
{
    public IEnumerable<IContact> Contacts { get; } = contacts ?? throw new ArgumentNullException(nameof(contacts));
    public IEnumerable<IUserPublic> Users { get; } = users ?? throw new ArgumentNullException(nameof(users));
}