using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Collections.Immutable;
using System.IO;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Threading;
using System.Threading.Tasks;
using Azure;
using Signal.Core.Auth;
using Signal.Core.Contacts;
using Signal.Core.Entities;
using Signal.Core.Processor;
using Signal.Core.Sharing;
using Signal.Core.Storage;
using Signal.Core.Storage.Blobs;
using Signal.Core.Users;
using BlobInfo = Signal.Core.Storage.Blobs.BlobInfo;

namespace Signal.Infrastructure.AzureStorage.Tables;

internal class AzureStorageDao : IAzureStorageDao
{
    private readonly IAzureStorageClientFactory clientFactory;
    private readonly Lazy<IUserService> userService;

    public AzureStorageDao(
        IAzureStorageClientFactory clientFactory,
        Lazy<IUserService> userService)
    {
        this.clientFactory = clientFactory ?? throw new ArgumentNullException(nameof(clientFactory));
        this.userService = userService ?? throw new ArgumentNullException(nameof(userService));
    }

    public async Task<IEnumerable<IContactHistoryItem>> ContactHistoryAsync(
        IContactPointer contactPointer,
        TimeSpan duration,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var client =
                await this.clientFactory.GetTableClientAsync(ItemTableNames.ContactsHistory, cancellationToken);
            var history = client.QueryAsync<AzureContactHistoryItem>(entry =>
                entry.PartitionKey == contactPointer.ToString(),
                cancellationToken: cancellationToken);

            // Limit history
            // TODO: Move this check to BLL
            var correctedDuration = duration;
            if (correctedDuration > TimeSpan.FromDays(90))
                correctedDuration = TimeSpan.FromDays(90);

            // Fetch all until reaching requested duration
            var items = new List<IContactHistoryItem>();
            var startDateTime = DateTime.UtcNow - correctedDuration;
            await foreach (var data in history)
            {
                var item = AzureContactHistoryItem.To(data);
                if (item.Timestamp < startDateTime)
                    break;

                items.Add(item);
            }

            return items;
        }
        catch (RequestFailedException ex) when (ex.Status == 404)
        {
            return Enumerable.Empty<IContactHistoryItem>();
        }
    }

    public async Task<string?> UserIdByEmailAsync(string userEmail, CancellationToken cancellationToken = default)
    {
        try
        {
            var client = await this.clientFactory.GetTableClientAsync(ItemTableNames.Users, cancellationToken);
            var query = client.QueryAsync<AzureUser>(
                u => u.Email == userEmail,
                cancellationToken: cancellationToken);
            await foreach (var match in query)
                return match.RowKey;
            return null;
        }
        catch (RequestFailedException ex) when (ex.Status == 404)
        {
            return null;
        }
    }

    public async Task<IUser?> UserAsync(string userId, CancellationToken cancellationToken = default)
    {
        try
        {
            var client = await this.clientFactory.GetTableClientAsync(ItemTableNames.Users, cancellationToken);
            return AzureUser.ToUser((await client.GetEntityAsync<AzureUser>(
                UserSources.GoogleOauth,
                userId,
                cancellationToken: cancellationToken)).Value);
        }
        catch (RequestFailedException ex) when (ex.Status == 404)
        {
            return null;
        }
    }

    public async Task<IEnumerable<IUser>> UsersAsync(
        IEnumerable<string> userIds,
        CancellationToken cancellationToken = default)
    {
        var client = await this.clientFactory.GetTableClientAsync(ItemTableNames.Users, cancellationToken);
        var users = await Task.WhenAll(PartitionKeyAndRowsWithKeysAnyFilter(UserSources.GoogleOauth, userIds)
            .Select(async queryFilter =>
                await EnumerateAsync(
                    client.QueryAsync<AzureUser>(queryFilter, cancellationToken: cancellationToken),
                    null,
                    AzureUser.ToUser,
                    cancellationToken: cancellationToken)));

        return users.SelectMany(u => u);
    }

    public async Task<IEnumerable<IUser>> UsersAllAsync(CancellationToken cancellationToken = default)
    {
        var client = await this.clientFactory.GetTableClientAsync(ItemTableNames.Users, cancellationToken);
        return await EnumerateAsync(
            client.QueryAsync<AzureUser>(cancellationToken: cancellationToken),
            null,
            AzureUser.ToUser,
            cancellationToken: cancellationToken);
    }

    public async Task<bool> PatExistsAsync(string userId, string patHash, CancellationToken cancellationToken = default)
    {
        var client = await this.clientFactory.GetTableClientAsync(ItemTableNames.AuthPats, cancellationToken);
        var patQuery = client.QueryAsync<AzureEntity>(
            e => e.PartitionKey == userId && e.RowKey == patHash,
            cancellationToken: cancellationToken);
        await foreach (var _ in patQuery)
            return true;
        return false;
    }

    public async Task<IEnumerable<IPat>> PatsAsync(string userId, CancellationToken cancellationToken = default)
    {
        var client = await this.clientFactory.GetTableClientAsync(ItemTableNames.AuthPats, cancellationToken);
        var patQuery = client.QueryAsync<AzureAuthPat>(
            e => e.PartitionKey == userId,
            cancellationToken: cancellationToken);
        return await EnumerateAsync(patQuery, null, AzureAuthPat.ToPat, cancellationToken);
    }

    public async Task<IEnumerable<IEntity>> UserEntitiesAsync(string userId, IEnumerable<EntityType>? types, CancellationToken cancellationToken = default)
    {
        var userAssignedEntitiesIds = (await this.UserAssignedAsync(userId, cancellationToken)).Select(uae => uae.EntityId).ToList();
        if (!userAssignedEntitiesIds.Any())
            return Enumerable.Empty<IEntity>();

        return await this.EntitiesInternalAsync(userAssignedEntitiesIds, types, cancellationToken);
    }

    public async Task<IEnumerable<IEntityDetailed>> UserEntitiesDetailedAsync(string userId, IEnumerable<EntityType>? types, CancellationToken cancellationToken = default)
    {
        var userAssignedEntitiesIds = (await this.UserAssignedAsync(userId, cancellationToken)).Select(uae => uae.EntityId);
        return await this.EntitiesDetailedAsync(userAssignedEntitiesIds, types, cancellationToken);
    }

    private async Task<IEnumerable<IEntityDetailed>> EntitiesDetailedAsync(
        IEnumerable<string> entityIds,
        IEnumerable<EntityType>? types,
        CancellationToken cancellationToken)
    {
        var entityIdsList = entityIds.ToList();
        if (!entityIdsList.Any())
            return Enumerable.Empty<IEntityDetailed>();

        var entitiesTask = this.EntitiesInternalAsync(entityIdsList, types, cancellationToken);
        var contactsTask = this.ContactsAsync(entityIdsList, cancellationToken);
        var usersTask = this.EntityPublicUsersAsync(entityIdsList, cancellationToken);
        await Task.WhenAll(entitiesTask, contactsTask, usersTask);

        return entitiesTask.Result.Select(e => new EntityDetailed(
            e.Type, e.Id, e.Alias,
            contactsTask.Result?.Where(c => c.EntityId == e.Id) ?? Enumerable.Empty<IContact>(),
            usersTask.Result[e.Id]));
    }

    private async Task<Dictionary<string, IEnumerable<IUserPublic>>> EntityPublicUsersAsync(
        IEnumerable<string> entityIds,
        CancellationToken cancellationToken = default)
    {
        // TODO: Persist entity users in entity property, use assigned entities table only as cache

        var entityIdsList = entityIds.ToList();
        var assignedEntityUsers = await this.AssignedUsersAsync(
            entityIdsList,
            cancellationToken);
        var assignedUsers = (await this.userService.Value.GetPublicAsync(
                assignedEntityUsers.Values.SelectMany(i => i).Distinct(),
                cancellationToken))
            .ToList();

        return entityIdsList.ToDictionary(
            entityId => entityId,
            entityId => assignedEntityUsers.TryGetValue(entityId, out var assignedEntityUserIds)
                ? assignedEntityUserIds
                    .Select(auId => assignedUsers.FirstOrDefault(u => u.UserId == auId))
                    .Where(user => user != null)
                    .Select(u => u!)
                : Enumerable.Empty<IUserPublic>());
    }

    private async Task<IEnumerable<IEntity>> EntitiesInternalAsync(
        IEnumerable<string> entityIds,
        IEnumerable<EntityType>? entityTypes,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var entityTypesList = entityTypes?.Select(et => et.ToString()).ToList();
            var client = await this.clientFactory.GetTableClientAsync(ItemTableNames.Entities, cancellationToken);

            return (await Task.WhenAll(RowsWithKeysAnyFilter(entityIds).Select(async queryFilter =>
                    await EnumerateAsync(
                        client.QueryAsync<AzureEntity>(
                            queryFilter,
                            cancellationToken: cancellationToken),
                        entity =>
                            entityTypesList == null ||
                            entityTypesList.Contains(entity.PartitionKey),
                        AzureEntity.ToEntity,
                        cancellationToken))))
                .SelectMany(i => i);
        }
        catch (RequestFailedException ex) when (ex.Status == 404)
        {
            return Enumerable.Empty<IEntity>();
        }
    }

    public async Task<IEntity?> GetAsync(string entityId, CancellationToken cancellationToken = default) =>
        (await this.EntitiesInternalAsync(new[] {entityId}, null, cancellationToken)).FirstOrDefault();

    public async Task<IEntityDetailed?> GetDetailedAsync(string entityId, CancellationToken cancellationToken = default) =>
        (await this.EntitiesDetailedAsync(new[] {entityId}, null, cancellationToken)).FirstOrDefault();

    public async Task<IContact?> ContactAsync(IContactPointer pointer, CancellationToken cancellationToken = default)
    {
        try
        {
            var azContact = AzureContact.From(pointer);
            var client = await this.clientFactory.GetTableClientAsync(ItemTableNames.Contacts, cancellationToken);
            var azContactResponse = await client.GetEntityAsync<AzureContact>(
                azContact.PartitionKey,
                azContact.RowKey,
                cancellationToken: cancellationToken);
            return AzureContact.ToContact(azContactResponse.Value);
        }
        catch (RequestFailedException ex) when (ex.Status == 404)
        {
            return null;
        }
    }

    public async Task<IEnumerable<IContact>?> ContactsAsync(
        string entityId,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var client = await this.clientFactory.GetTableClientAsync(ItemTableNames.Contacts, cancellationToken);
            var statesAsync =
                client.QueryAsync<AzureContact>(q => q.PartitionKey == entityId, cancellationToken: cancellationToken);
            return await EnumerateAsync(statesAsync, null, AzureContact.ToContact, cancellationToken);
        }
        catch (RequestFailedException ex) when (ex.Status == 404)
        {
            return null;
        }
    }

    public async Task<IEnumerable<IContact>?> ContactsAsync(
        IEnumerable<string> entityIds,
        CancellationToken cancellationToken = default)
    {
        var entityIdsList = entityIds.ToList();
        if (!entityIdsList.Any())
            return Enumerable.Empty<IContact>();

        var client = await this.clientFactory.GetTableClientAsync(ItemTableNames.Contacts, cancellationToken);
        var states = new ConcurrentBag<IContact>();
        await Task.WhenAll(PartitionsAnyFilter(entityIdsList).Select(async queryFilter =>
        {
            var contactsQuery = client.QueryAsync<AzureContact>(queryFilter, cancellationToken: cancellationToken);
            var items = await EnumerateAsync(contactsQuery, null, AzureContact.ToContact, cancellationToken);
            foreach (var item in items)
                states.Add(item);
        }));
        return states;
    }

    private static IEnumerable<string> PartitionsAnyFilter(IEnumerable<string> partitionKeys) =>
        partitionKeys.Chunk(400).Select(pk =>
            $"({string.Join(" or", pk.Select(tl => $"(PartitionKey eq '{tl}')"))})");

    private static IEnumerable<string> PartitionKeyAndRowsWithKeysAnyFilter(string partitionKey, IEnumerable<string> rowKeys) =>
        rowKeys.Chunk(400).Select(rk =>
            $"(PartitionKey eq '{partitionKey}') and ({string.Join(" or", rk.Select(tl => $"(RowKey eq '{tl}')"))})");

    private static IEnumerable<string> RowsWithKeysAnyFilter(IEnumerable<string> rowKeys) =>
        rowKeys.Chunk(400).Select(rk =>
            $"({string.Join(" or", rk.Select(tl => $"(RowKey eq '{tl}')"))})");

    public async Task<Stream> LoggingDownloadAsync(string blobName, CancellationToken cancellationToken = default)
    {
        var client =
            await this.clientFactory.GetAppendBlobClientAsync(BlobContainerNames.StationLogs, blobName,
                cancellationToken);
        return await client.OpenReadAsync(false, cancellationToken: cancellationToken);
    }

    public async Task<bool> EntityExistsAsync(string id, CancellationToken cancellationToken = default)
    {
        var client = await this.clientFactory.GetTableClientAsync(ItemTableNames.Entities, cancellationToken);
        var entityQuery = client.QueryAsync<AzureEntity>(e => e.RowKey == id, cancellationToken: cancellationToken);
        await foreach (var _ in entityQuery)
            return true;
        return false;
    }

    public async Task<IEnumerable<IContactLinkProcessTriggerItem>> ContactLinkProcessTriggersAsync(IContactPointer pointer, CancellationToken cancellationToken = default)
    {
        var client = await this.clientFactory.GetTableClientAsync(ItemTableNames.ContactLinks, cancellationToken);
        var linksQuery = client.QueryAsync<AzureContactLinkProcessTriggerItem>(q => q.PartitionKey == $"triggerProcess-{pointer}");
        return await EnumerateAsync(linksQuery, null, AzureContactLinkProcessTriggerItem.To, cancellationToken);
    }

    public async Task<IEnumerable<IContactLinkProcessTriggerItem>> ContactLinkProcessTriggersAsync(string processEntityId, CancellationToken cancellationToken = default)
    {
        var client = await this.clientFactory.GetTableClientAsync(ItemTableNames.ContactLinks, cancellationToken);
        var linksQuery = client.QueryAsync<AzureContactLinkProcessTriggerItem>(q => q.RowKey == processEntityId);
        return await EnumerateAsync(linksQuery, null, AzureContactLinkProcessTriggerItem.To, cancellationToken);
    }

    public async IAsyncEnumerable<IBlobInfo> LoggingListAsync(string stationId, [EnumeratorCancellation] CancellationToken cancellationToken = default)
    {
        var client =
            await this.clientFactory.GetBlobContainerClientAsync(BlobContainerNames.StationLogs, cancellationToken);
        var blobsQuery = client.GetBlobsByHierarchyAsync(prefix: stationId, cancellationToken: cancellationToken);
        if (blobsQuery == null)
            yield break;

        await foreach (var blobHierarchyItem in blobsQuery.WithCancellation(cancellationToken))
        {
            // Skip deleted
            if (blobHierarchyItem.Blob.Deleted)
                continue;

            // Retrieve interesting data
            var info = new BlobInfo(blobHierarchyItem.Blob.Name)
            {
                CreatedTimeStamp = blobHierarchyItem.Blob.Properties.CreatedOn,
                LastModifiedTimeStamp = blobHierarchyItem.Blob.Properties.LastModified,
                Size = blobHierarchyItem.Blob.Properties.ContentLength
            };

            yield return info;
        }
    }

    public async Task<bool> IsUserAssignedAsync(string userId, string entityId, CancellationToken cancellationToken = default) =>
        await this.IsUserDirectAssignedAsync(userId, entityId, cancellationToken) ||
        await this.IsPublicAssignedAsync(entityId, cancellationToken);

    private async Task<bool> IsPublicAssignedAsync(
        string entityId,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var client =
                await this.clientFactory.GetTableClientAsync(ItemTableNames.UserAssignedEntity, cancellationToken);
            var assignment = await client.GetEntityAsync<AzureUserAssignedEntitiesTableEntry>(
                "public", entityId, cancellationToken: cancellationToken);
            return assignment.Value != null;
        }
        catch (RequestFailedException ex) when (ex.Status == 404)
        {
            return false;
        }
    }

    private async Task<bool> IsUserDirectAssignedAsync(
        string userId,
        string entityId,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var client =
                await this.clientFactory.GetTableClientAsync(ItemTableNames.UserAssignedEntity, cancellationToken);
            var assignment = await client.GetEntityAsync<AzureUserAssignedEntitiesTableEntry>(
                userId, entityId, cancellationToken: cancellationToken);
            return assignment.Value != null;
        }
        catch (RequestFailedException ex) when (ex.Status == 404)
        {
            return false;
        }
    }

    public async Task<IReadOnlyDictionary<string, IEnumerable<string>>> AssignedUsersAsync(
        IEnumerable<string> entityIds,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var entityIdsList = entityIds.ToList();
            if (!entityIdsList.Any())
                return ImmutableDictionary<string, IEnumerable<string>>.Empty;

            var client =
                await this.clientFactory.GetTableClientAsync(ItemTableNames.UserAssignedEntity, cancellationToken);

            var assignedUsers = new ConcurrentDictionary<string, IEnumerable<string>>();
            await Task.WhenAll(RowsWithKeysAnyFilter(entityIdsList).Select(async queryFilter =>
            {
                var assigned = client.QueryAsync<AzureUserAssignedEntitiesTableEntry>(
                    queryFilter,
                    cancellationToken: cancellationToken);

                // Enumerate all
                var assignedItems = await EnumerateAsync(
                    assigned,
                    null,
                    i => i, cancellationToken);

                foreach (var entity in assignedItems)
                {
                    assignedUsers.AddOrUpdate(
                        entity.RowKey,
                        new List<string> {entity.PartitionKey},
                        (_, item) =>
                        {
                            (item as ICollection<string>)?.Add(entity.PartitionKey);
                            return item;
                        });
                }
            }));

            return assignedUsers;
        }
        catch (RequestFailedException ex) when (ex.Status == 404)
        {
            return ImmutableDictionary<string, IEnumerable<string>>.Empty;
        }
    }

    public async Task<IEnumerable<IUserAssignedEntity>> UserAssignedAsync(
        string userId,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var client = await this.clientFactory.GetTableClientAsync(ItemTableNames.UserAssignedEntity, cancellationToken);
            var assignments = await Task.WhenAll(PartitionsAnyFilter(new[] {userId, "public"})
                .Select(queryFilter =>
                    EnumerateAsync(
                        client.QueryAsync<AzureUserAssignedEntitiesTableEntry>(
                            queryFilter,
                            cancellationToken: cancellationToken),
                        null,
                        entity => new UserAssignedEntity(userId, entity.RowKey),
                        cancellationToken)));

            return assignments.SelectMany(i => i);
        }
        catch (RequestFailedException ex) when (ex.Status == 404)
        {
            return Enumerable.Empty<IUserAssignedEntity>();
        }
    }

    private static async Task<IEnumerable<TOut>> EnumerateAsync<T, TOut>(
        IAsyncEnumerable<T> statesAsync,
        Func<T, bool>? filter,
        Func<T, TOut> transform,
        CancellationToken cancellationToken = default) where T : notnull
    {
        var states = new ConcurrentBag<TOut>();
        await Parallel.ForEachAsync(statesAsync, cancellationToken, (state, _) =>
        {
            if (filter == null || filter(state))
                states.Add(transform(state));
            return ValueTask.CompletedTask;
        });
        return states;
    }
}