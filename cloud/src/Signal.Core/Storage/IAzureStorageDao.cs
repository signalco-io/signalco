using System;
using System.Collections.Generic;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using Signal.Core.Auth;
using Signal.Core.Contacts;
using Signal.Core.Entities;
using Signal.Core.Processor;
using Signal.Core.Sharing;
using Signal.Core.Storage.Blobs;
using Signal.Core.Users;

namespace Signal.Core.Storage;

public interface IAzureStorageDao
{
    Task<bool> PatExistsAsync(
        string userId, 
        string patHash, 
        CancellationToken cancellationToken = default);

    Task<IEnumerable<IPat>> PatsAsync(string userId, CancellationToken cancellationToken = default);

    Task<IEnumerable<IEntity>> UserEntitiesAsync(
        string userId, 
        IEnumerable<EntityType>? types, 
        CancellationToken cancellationToken = default);

    Task<IEnumerable<IEntityDetailed>> UserEntitiesDetailedAsync(
        string userId, 
        IEnumerable<EntityType>? types, 
        CancellationToken cancellationToken = default);

    Task<IEntity?> GetAsync(string entityId, CancellationToken cancellationToken = default);

    Task<IContact?> ContactAsync(IContactPointer pointer, CancellationToken cancellationToken = default);

    Task<IEnumerable<IContact>?> ContactsAsync(
        string entityId,
        CancellationToken cancellationToken = default);

    Task<IEnumerable<IContact>?> ContactsAsync(
        IEnumerable<string> entityIds,
        CancellationToken cancellationToken = default);

    Task<bool> IsUserAssignedAsync(string userId, string entityId, CancellationToken cancellationToken = default);

    Task<IEnumerable<IContactHistoryItem>> ContactHistoryAsync(
        IContactPointer contactPointer,
        TimeSpan duration,
        CancellationToken cancellationToken = default);
    
    Task<IUser?> UserAsync(string userId, CancellationToken cancellationToken = default);

    Task<IEnumerable<IUser>> UsersAsync(IEnumerable<string> userIds, CancellationToken cancellationToken = default);

    Task<string?> UserIdByEmailAsync(string userEmail, CancellationToken cancellationToken = default);

    Task<IReadOnlyDictionary<string, IEnumerable<string>>> AssignedUsersAsync(
        IEnumerable<string> entityIds,
        CancellationToken cancellationToken = default);
    
    IAsyncEnumerable<IBlobInfo> LoggingListAsync(string stationId, CancellationToken cancellationToken = default);

    Task<Stream> LoggingDownloadAsync(string blobName, CancellationToken cancellationToken = default);

    Task<bool> EntityExistsAsync(string id, CancellationToken cancellationToken = default);

    Task<IEnumerable<IContactLinkProcessTriggerItem>> ContactLinkProcessTriggersAsync(
        IContactPointer pointer,
        CancellationToken cancellationToken = default);

    Task<IEnumerable<IContactLinkProcessTriggerItem>> ContactLinkProcessTriggersAsync(
        string processEntityId, 
        CancellationToken cancellationToken = default);

    Task<IEntityDetailed?> GetDetailedAsync(string entityId, CancellationToken cancellationToken = default);

    Task<IEnumerable<IUser>> UsersAllAsync(CancellationToken cancellationToken = default);

    Task<IEnumerable<IUserAssignedEntity>> UserAssignedAsync(
        string userId,
        CancellationToken cancellationToken = default);
}