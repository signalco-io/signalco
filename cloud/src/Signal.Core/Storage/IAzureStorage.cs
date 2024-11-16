using System;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using Signal.Core.Contacts;
using Signal.Core.Entities;
using Signal.Core.Newsletter;
using Signal.Core.Processor;
using Signal.Core.Sharing;
using Signal.Core.Users;

namespace Signal.Core.Storage;

public interface IAzureStorage
{
    Task PatCreateAsync(
        string userId, 
        string patEnd, 
        string patHash, 
        string? alias, 
        DateTime? expire, 
        CancellationToken cancellationToken = default);

    Task UpsertAsync(IEntity entity, CancellationToken cancellationToken = default);

    Task UpsertAsync(IContactPointer contact, CancellationToken cancellationToken = default);

    Task UpsertAsync(IContact contact, CancellationToken cancellationToken = default);

    Task UpsertAsync(IContactHistoryItem item, CancellationToken cancellationToken = default);

    Task UpsertAsync(IUserAssignedEntity userAssignment, CancellationToken cancellationToken = default);

    Task UpsertAsync(IUser user, CancellationToken cancellationToken = default);

    Task UpsertAsync(INewsletterSubscription subscription, CancellationToken cancellationToken = default);

    Task RemoveEntityAsync(string id, CancellationToken cancellationToken = default);
    Task RemoveContactLinksProcessTriggersAsync(string processEntityId, CancellationToken cancellationToken = default);

    Task AppendToFileAsync(string directory, string fileName, Stream data, CancellationToken cancellationToken = default);
    Task QueueAsync(ContactStateProcessQueueItem item, CancellationToken cancellationToken = default);
    Task QueueAsync(UsageQueueItem? item, CancellationToken cancellationToken = default);
    Task UpsertAsync(IContactLinkProcessTriggerItem cacheItem, CancellationToken cancellationToken = default);
    Task RemoveAsync(IContactPointer contactPointer, CancellationToken cancellationToken);
    Task RemoveAsync(IUserAssignedEntity assignment, CancellationToken cancellationToken = default);
    Task EnsureTableAsync(string tableName, CancellationToken cancellationToken = default);
    Task EnsureQueueAsync(string queueName, CancellationToken cancellationToken = default);
}