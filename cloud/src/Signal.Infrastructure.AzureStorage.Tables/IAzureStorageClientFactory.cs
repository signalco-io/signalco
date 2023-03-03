using System.Threading;
using System.Threading.Tasks;
using Azure.Data.Tables;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Specialized;
using Azure.Storage.Queues;

namespace Signal.Infrastructure.AzureStorage.Tables;

public interface IAzureStorageClientFactory
{
    Task<TableClient> GetTableClientAsync(string tableName, CancellationToken cancellationToken = default);
    Task<AppendBlobClient> GetAppendBlobClientAsync(string containerName, string filePath, CancellationToken cancellationToken = default);
    Task<BlobContainerClient> GetBlobContainerClientAsync(string containerName, CancellationToken cancellationToken = default);
    Task<QueueClient> GetQueueClientAsync(string queueName, CancellationToken cancellationToken = default);
}