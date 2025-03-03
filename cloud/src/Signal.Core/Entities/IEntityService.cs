using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Signal.Core.Contacts;

namespace Signal.Core.Entities;

public interface IEntityService
{
    Task<IEnumerable<IEntity>> AllAsync(
        string userId, 
        IEnumerable<EntityType>? types = null, 
        CancellationToken cancellationToken = default);
    
    Task<IEnumerable<IEntityDetailed>> AllDetailedAsync(
        string userId, 
        IEnumerable<EntityType>? types = null, 
        CancellationToken cancellationToken = default);

    Task<IEntity?> GetInternalAsync(string entityId, CancellationToken cancellationToken = default);

    Task<IEntityDetailed?> GetDetailedAsync(string userId, string entityId, CancellationToken cancellationToken = default);

    Task<string> UpsertAsync(string userId, string? id, Func<string, IEntity> entityFunc, CancellationToken cancellationToken = default);

    public Task<IContact?> ContactAsync(
        IContactPointer pointer,
        CancellationToken cancellationToken = default);

    public Task<IEnumerable<IContact>?> ContactsAsync(
        string entityId,
        CancellationToken cancellationToken = default);

    public Task<IEnumerable<IContact?>> ContactsAsync(
        IEnumerable<IContactPointer> pointers,
        CancellationToken cancellationToken = default);

    public Task<IEnumerable<IContact>?> ContactsAsync(
        IEnumerable<string> entityIds,
        CancellationToken cancellationToken = default);

    Task RemoveAsync(string userId, string id, CancellationToken cancellationToken = default);

    Task<bool> IsUserAssignedAsync(string userId, string id, CancellationToken cancellationToken = default);

    Task<IReadOnlyDictionary<string, IEnumerable<string>>> EntityUsersAsync(
        IEnumerable<string> entityIds,
        CancellationToken cancellationToken = default);

    Task BroadcastToEntityUsersAsync(
        string entityId,
        string hubName,
        string target,
        object[] arguments,
        CancellationToken cancellationToken = default);

    Task ContactSetAsync(
        IContactPointer pointer,
        string? valueSerialized,
        DateTime? timeStamp = null,
        CancellationToken cancellationToken = default,
        bool doNotProcess = false,
        bool doNotNotify = false,
        bool doNotCache = false);

    Task ContactSetMetadataAsync(
        IContactPointer pointer,
        string? metadata,
        CancellationToken cancellationToken = default);

    Task ContactDeleteAsync(
        string userId, 
        IContactPointer pointer,
        CancellationToken cancellationToken = default);
}