using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Azure.Storage.Queues;
using Azure.Storage.Queues.Models;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using Signal.Core.Contacts;
using Signal.Core.Entities;
using Signal.Core.Processor;
using Signal.Core.Usage;
using Signal.Infrastructure.AzureStorage.Tables;

namespace Signalco.Func.Internal.UsageProcessor;

public class UsageProcessTrigger(
    IEntityService entityService,
    IAzureStorageClientFactory clientFactory,
    ILogger<UsageProcessTrigger> logger)
{
    private const string QueueName = "usage-processing";
    private const int BatchSize = 32;
    private const int MaxDequeueCount = 5;
    private static readonly TimeSpan ProcessingWindow = TimeSpan.FromSeconds(45);
    // Keep messages hidden beyond the function's five-minute timeout, including on host failure.
    private static readonly TimeSpan VisibilityTimeout = TimeSpan.FromMinutes(10);

    [Function("UsageProcessTrigger")]
    public async Task Run(
        [TimerTrigger("0 */15 * * * *")] TimerInfo timer,
        CancellationToken cancellationToken = default)
    {
        var queue = await clientFactory.GetQueueClientAsync(QueueName, cancellationToken);
        await queue.CreateIfNotExistsAsync(cancellationToken: cancellationToken);
        var stopwatch = Stopwatch.StartNew();

        // Finish each received batch before taking another; leave a backlog for the next tick.
        while (stopwatch.Elapsed < ProcessingWindow)
        {
            cancellationToken.ThrowIfCancellationRequested();
            var messages = (await queue.ReceiveMessagesAsync(BatchSize, VisibilityTimeout, cancellationToken)).Value;
            if (messages.Length == 0)
                break;

            var items = new List<(QueueMessage Message, UsageQueueItem Item)>();
            foreach (var message in messages)
            {
                try
                {
                    // Producers explicitly Base64-encode JSON; the shared SDK client uses no decoding.
                    var item = JsonSerializer.Deserialize<UsageQueueItem>(
                        Convert.FromBase64String(message.Body.ToString()));
                    if (item == null || string.IsNullOrWhiteSpace(item.UserId))
                        throw new JsonException("Invalid usage queue item");
                    items.Add((message, item));
                }
                catch (Exception ex) when (ex is JsonException or FormatException)
                {
                    logger.LogWarning("Invalid usage message {MessageId}", message.MessageId);
                    await HandleFailedMessageAsync(queue, message, cancellationToken);
                }
            }

            var now = DateTime.UtcNow;
            foreach (var group in items.GroupBy(i => i.Item.UserId))
            {
                try
                {
                    await ProcessUsageAsync(group.Key, group.Select(i => i.Item), now, cancellationToken);
                }
                catch (Exception ex) when (ex is not OperationCanceledException)
                {
                    logger.LogError(ex, "Failed to process {Count} usage items", group.Count());
                    foreach (var item in group)
                        await HandleFailedMessageAsync(queue, item.Message, cancellationToken);
                    continue;
                }

                // Acknowledge only after this user's total has been persisted.
                foreach (var item in group)
                    await queue.DeleteMessageAsync(item.Message.MessageId, item.Message.PopReceipt, cancellationToken);
            }
        }
    }

    private async Task HandleFailedMessageAsync(
        QueueClient queue,
        QueueMessage message,
        CancellationToken cancellationToken)
    {
        if (message.DequeueCount < MaxDequeueCount)
            return;

        var poisonQueue = await clientFactory.GetQueueClientAsync($"{QueueName}-poison", cancellationToken);
        await poisonQueue.CreateIfNotExistsAsync(cancellationToken: cancellationToken);
        await poisonQueue.SendMessageAsync(message.Body, cancellationToken: cancellationToken);
        await queue.DeleteMessageAsync(message.MessageId, message.PopReceipt, cancellationToken);
        logger.LogWarning("Moved usage message {MessageId} to the poison queue", message.MessageId);
    }

    private async Task ProcessUsageAsync(
        string userId,
        IEnumerable<UsageQueueItem> items,
        DateTime now,
        CancellationToken cancellationToken)
    {
        // Retrieve or create user entity
        var userEntity = (await entityService.AllAsync(userId, new[] {EntityType.User}, cancellationToken)).FirstOrDefault();
        if (userEntity == null)
        {
            var userEntityId = await entityService.UpsertAsync(
                userId,
                null,
                id => new Entity(EntityType.User, id, "Me"),
                cancellationToken);
            userEntity = await entityService.GetInternalAsync(userEntityId, cancellationToken);
        }

        if (userEntity == null)
            throw new Exception("Unexpected entity");
            
        // Calculate updated usage
        var contactName = $"usage-{now.Year}{now.Month:D2}{now.Day:D2}";
        var currentUsageValueSerialized = (await entityService.ContactAsync(
            new ContactPointer(userEntity.Id, "signalco", contactName),
            cancellationToken))?.ValueSerialized;
        var usage = JsonSerializer.Deserialize<Usage>(currentUsageValueSerialized ?? "{}") ??
                    new Usage(0, 0, 0, 0);
        foreach (var item in items)
        {
            usage = item.Kind switch
            {
                UsageKind.ContactSet => usage with {ContactSet = usage.ContactSet + 1},
                UsageKind.Conduct => usage with {Conduct = usage.Conduct + 1},
                UsageKind.Process => usage with {Process = usage.Process + 1},
                _ => usage with {Other = usage.Other + 1}
            };
        }

        // Update contact
        await entityService.ContactSetAsync(
            new ContactPointer(userEntity.Id, "signalco", contactName),
            JsonSerializer.Serialize(usage),
            cancellationToken: cancellationToken,
            doNotProcess: true,
            doNotNotify: true,
            doNotCache: true,
            throwOnError: true);
    }
}
