using System;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Azure.Data.Tables;
using Azure.Storage.Queues;
using Signal.Core.Contacts;
using Signal.Core.Entities;
using Signal.Core.Newsletter;
using Signal.Core.Processor;
using Signal.Core.Sharing;
using Signal.Core.Storage;
using Signal.Core.Storage.Blobs;
using Signal.Core.Users;

namespace Signal.Infrastructure.AzureStorage.Tables;

internal class AzureStorage(
    IAzureStorageDao dao,
    IAzureStorageClientFactory clientFactory)
    : IAzureStorage
{
    public async Task PatCreateAsync(string userId, string patEnd, string patHash, string? alias, DateTime? expire, CancellationToken cancellationToken = default) =>
        await this.WithClientAsync(
            ItemTableNames.AuthPats,
            c => c.AddEntityAsync(new AzureAuthPat(userId, patHash, patEnd, alias, expire), cancellationToken),
            cancellationToken);

    public async Task UpsertAsync(IEntity entity, CancellationToken cancellationToken = default) =>
        await this.WithClientAsync(
            ItemTableNames.Entities,
            c => c.UpsertEntityAsync(AzureEntity.From(entity), cancellationToken: cancellationToken),
            cancellationToken);

    public async Task UpsertAsync(IContactPointer contact, CancellationToken cancellationToken = default) =>
        await this.WithClientAsync(
            ItemTableNames.Contacts,
            c => c.UpsertEntityAsync(AzureContact.From(contact), cancellationToken: cancellationToken),
            cancellationToken);

    public async Task UpsertAsync(IContact contact, CancellationToken cancellationToken = default) =>
        await this.WithClientAsync(
            ItemTableNames.Contacts,
            c => c.UpsertEntityAsync(AzureContact.From(contact), cancellationToken: cancellationToken),
            cancellationToken);

    public async Task UpsertAsync(IContactHistoryItem item, CancellationToken cancellationToken = default) =>
        await this.WithClientAsync(
            ItemTableNames.ContactsHistory,
            c => c.UpsertEntityAsync(AzureContactHistoryItem.From(item), cancellationToken: cancellationToken),
            cancellationToken);

    public async Task UpsertAsync(IContactLinkProcessTriggerItem cacheItem, CancellationToken cancellationToken = default) =>
        await this.WithClientAsync(
            ItemTableNames.ContactLinks,
            c => c.UpsertEntityAsync(AzureContactLinkProcessTriggerItem.From(cacheItem), cancellationToken: cancellationToken),
            cancellationToken);

    public async Task UpsertAsync(IUserAssignedEntity userAssignment, CancellationToken cancellationToken = default) =>
        await this.WithClientAsync(
            ItemTableNames.UserAssignedEntity,
            c => c.UpsertEntityAsync(AzureUserAssignedEntitiesTableEntry.From(userAssignment), cancellationToken: cancellationToken),
            cancellationToken);

    public async Task UpsertAsync(IUser user, CancellationToken cancellationToken = default) =>
        await this.WithClientAsync(
            ItemTableNames.Users,
            c => c.UpsertEntityAsync(AzureUser.From(user), cancellationToken: cancellationToken),
            cancellationToken);

    public async Task UpsertAsync(INewsletterSubscription subscription, CancellationToken cancellationToken = default) =>
        await this.WithClientAsync(
            ItemTableNames.Website.Newsletter,
            client => client.UpsertEntityAsync(new AzureNewsletterSubscription(subscription.Email),
                cancellationToken: cancellationToken),
            cancellationToken);

    public async Task QueueAsync(ContactStateProcessQueueItem item, CancellationToken cancellationToken = default) =>
        await this.WithQueueClientAsync(
            ItemQueueNames.ContactStateProcessingQueue,
            client => client.SendMessageAsync(
                BinaryData.FromString(Convert.ToBase64String(Encoding.UTF8.GetBytes(JsonSerializer.Serialize(item)))),
                cancellationToken: cancellationToken), cancellationToken);

    public async Task QueueAsync(UsageQueueItem? item, CancellationToken cancellationToken = default)
    {
        if (item == null)
            return;

        await this.WithQueueClientAsync(
            ItemQueueNames.UsageQueue,
            client => client.SendMessageAsync(
                BinaryData.FromString(Convert.ToBase64String(Encoding.UTF8.GetBytes(JsonSerializer.Serialize(item)))),
                cancellationToken: cancellationToken), cancellationToken);
    }

    public async Task RemoveAsync(IContactPointer contactPointer, CancellationToken cancellationToken)
    {
        var (partitionKey, rowKey) = AzureContact.ToStorageIdentifier(contactPointer);

        // Delete contact history
        await this.WithClientAsync(
            ItemTableNames.ContactsHistory,
            async c =>
            {
                var items = c.QueryAsync<AzureContactHistoryItem>(entry =>
                        entry.PartitionKey == contactPointer.ToString(),
                    cancellationToken: cancellationToken);
                var itemsPages = items.AsPages(null, 100);
                await foreach (var page in itemsPages)
                    await c.SubmitTransactionAsync(page.Values.Select(pageItem => new TableTransactionAction(
                        TableTransactionActionType.Delete,
                        pageItem)), cancellationToken);
            }, cancellationToken);

        // Delete contact
        await this.WithClientAsync(
            ItemTableNames.Contacts,
            c => c.DeleteEntityAsync(partitionKey, rowKey, cancellationToken: cancellationToken), cancellationToken);
    }

    public async Task RemoveAsync(IUserAssignedEntity assignment, CancellationToken cancellationToken = default) =>
        await this.WithClientAsync(
            ItemTableNames.UserAssignedEntity,
            c =>
            {
                var item = AzureUserAssignedEntitiesTableEntry.From(assignment);
                return c.DeleteEntityAsync(item.PartitionKey, item.RowKey, cancellationToken: cancellationToken);
            },
            cancellationToken);

    public async Task RemoveEntityAsync(
        string id,
        CancellationToken cancellationToken = default)
    {
        var entity = await dao.GetAsync(id, cancellationToken);
        if (entity != null)
        {
            await this.WithClientAsync(
                ItemTableNames.Entities,
                client => client.DeleteEntityAsync(
                    entity.Type.ToString(),
                    entity.Id,
                    cancellationToken: cancellationToken),
                cancellationToken);
        }
    }

    public async Task RemoveContactLinksProcessTriggersAsync(
        string processEntityId,
        CancellationToken cancellationToken = default)
    {
        var links = await dao.ContactLinkProcessTriggersAsync(processEntityId, cancellationToken);
        await this.WithClientAsync(
            ItemTableNames.ContactLinks,
            async client => await Task.WhenAll(links.Select(async l =>
            {
                var item = AzureContactLinkProcessTriggerItem.From(l);
                return await client.DeleteEntityAsync(item.PartitionKey, item.RowKey, cancellationToken: cancellationToken);
            })),
            cancellationToken);
    }

    public async Task AppendToFileAsync(string directory, string fileName, Stream data, CancellationToken cancellationToken = default)
    {
        var client = await clientFactory.GetAppendBlobClientAsync(
            BlobContainerNames.StationLogs,
            $"{directory.Replace("\\", "/")}/{fileName}",
            cancellationToken);

        // TODO: Handle data sizes over 4MB
        await client.AppendBlockAsync(data, cancellationToken: cancellationToken);
    }

    public async Task EnsureTableAsync(string tableName, CancellationToken cancellationToken = default) =>
        await this.WithClientAsync(tableName, client => client.CreateIfNotExistsAsync(cancellationToken), cancellationToken);

    public async Task EnsureQueueAsync(string queueName, CancellationToken cancellationToken = default) =>
        await this.WithQueueClientAsync(queueName, client => client.CreateIfNotExistsAsync(cancellationToken: cancellationToken), cancellationToken);

    private async Task WithQueueClientAsync(string queueName, Func<QueueClient, Task> action, CancellationToken cancellationToken = default) =>
        await action(await clientFactory.GetQueueClientAsync(queueName, cancellationToken));

    private async Task WithClientAsync(string tableName, Func<TableClient, Task> action, CancellationToken cancellationToken = default) =>
        await action(await clientFactory.GetTableClientAsync(tableName, cancellationToken));
}