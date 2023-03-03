using System.Collections.Generic;
using Signal.Core.Contacts;
using Signal.Core.Users;

namespace Signal.Core.Entities;

public interface IEntityDetailed : IEntity
{
    public IEnumerable<IContact> Contacts { get; }

    public IEnumerable<IUserPublic> Users { get; }
}