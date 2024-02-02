using System.Collections.Concurrent;
using System.Threading;
using System.Threading.Tasks;
using Azure.Data.Tables;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Specialized;
using Azure.Storage.Queues;
using Signal.Core.Secrets;

namespace Signal.Infrastructure.AzureStorage.Tables;

public class AzureStorageClientFactory(ISecretsProvider secretsProvider) : IAzureStorageClientFactory
{
    private static readonly ConcurrentDictionary<string, BlobContainerClient> EstablishedBlobContainerClients = new();
    private static readonly ConcurrentDictionary<string, AppendBlobClient> EstablishedAppendBlobClients = new();
    private static readonly ConcurrentDictionary<string, TableClient> EstablishedTableClients = new();
    private static readonly ConcurrentDictionary<string, QueueClient> EstablishedQueueClients = new();

    public async Task<BlobContainerClient> GetBlobContainerClientAsync(string containerName, CancellationToken cancellationToken = default)
    {
        // Return established client if available
        if (EstablishedBlobContainerClients.TryGetValue(containerName, out var client))
            return client;

        client = new BlobContainerClient(
            await this.GetConnectionStringAsync(cancellationToken),
            containerName);
        EstablishedBlobContainerClients.TryAdd(containerName, client);

        // Create container if doesn't exist
        await client.CreateIfNotExistsAsync(cancellationToken: cancellationToken);

        return client;
    }

    public async Task<AppendBlobClient> GetAppendBlobClientAsync(string containerName, string filePath, CancellationToken cancellationToken = default)
    {
        // Return established client if available
        var cacheKey = $"{containerName}|{filePath}";
        if (EstablishedAppendBlobClients.TryGetValue(cacheKey, out var client))
            return client;

        var container = await this.GetBlobContainerClientAsync(containerName, cancellationToken);
        client = container.GetAppendBlobClient(filePath);
        EstablishedAppendBlobClients.TryAdd(cacheKey, client);

        // Create append blob if doesn't exist
        await client.CreateIfNotExistsAsync(cancellationToken: cancellationToken);

        return client;
    }

    public async Task<QueueClient> GetQueueClientAsync(string queueName, CancellationToken cancellationToken = default)
    {
        // Return established client if available
        if (EstablishedQueueClients.TryGetValue(queueName, out var client))
            return client;

        client = new QueueClient(
            await this.GetConnectionStringAsync(cancellationToken),
            AzureTableExtensions.EscapeKey(queueName));
        EstablishedQueueClients.TryAdd(queueName, client);

        return client;
    }


    public async Task<TableClient> GetTableClientAsync(string tableName, CancellationToken cancellationToken = default)
    {
        // Return established client if available
        if (EstablishedTableClients.TryGetValue(tableName, out var client))
            return client;

        // Instantiate new client and persist
        client = new TableClient(
            await this.GetConnectionStringAsync(cancellationToken),
            AzureTableExtensions.EscapeKey(tableName));
        EstablishedTableClients.TryAdd(tableName, client);

        return client;
    }

    private async Task<string> GetConnectionStringAsync(CancellationToken cancellationToken = default) =>
        await secretsProvider.GetSecretAsync(SecretKeys.StorageAccountConnectionString, cancellationToken);
}