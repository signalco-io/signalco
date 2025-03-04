using System;
using System.Linq;
using System.Net;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using Signal.Core.Contacts;
using Signal.Core.Entities;
using Signal.Core.Exceptions;
using Signal.Core.Processor;
using Signal.Core.Secrets;
using Signal.Core.Usage;

namespace Signalco.Func.Internal.UsageProcessor;

public class UsageProcessTrigger(
    IEntityService entityService,
    ILogger<UsageProcessTrigger> logger)
{
    [Function("UsageProcessTrigger")]
    public async Task Run(
        [QueueTrigger("usage-processing", Connection = SecretKeys.StorageAccountConnectionString)]
        string item,
        CancellationToken cancellationToken = default)
    {
        var queueItem = JsonSerializer.Deserialize<UsageQueueItem>(item) ??
                        throw new ExpectedHttpException(HttpStatusCode.BadRequest, "Invalid queue item data");

        logger.LogInformation("Dequeued usage item: {@UsageItem}", queueItem);

        // TODO: Move to service
        // Retrieve or create user entity
        var userEntity = (await entityService.AllAsync(queueItem.UserId, new[] {EntityType.User}, cancellationToken)).FirstOrDefault();
        if (userEntity == null)
        {
            var userEntityId = await entityService.UpsertAsync(
                queueItem.UserId,
                null,
                id => new Entity(EntityType.User, id, "Me"),
                cancellationToken);
            userEntity = await entityService.GetInternalAsync(userEntityId, cancellationToken);
        }

        if (userEntity == null)
            throw new Exception("Unexpected entity");
            
        // Calculate updated usage
        var now = DateTime.UtcNow;
        var contactName = $"usage-{now.Year}{now.Month:D2}{now.Day:D2}";
        var currentUsageValueSerialized = (await entityService.ContactAsync(
            new ContactPointer(userEntity.Id, "signalco", contactName),
            cancellationToken))?.ValueSerialized;
        var usage = JsonSerializer.Deserialize<Usage>(currentUsageValueSerialized ?? "{}") ??
                    new Usage(0, 0, 0, 0);
        usage = queueItem.Kind switch
        {
            UsageKind.ContactSet => usage with {ContactSet = usage.ContactSet + 1},
            UsageKind.Conduct => usage with {Conduct = usage.Conduct + 1},
            UsageKind.Process => usage with {Process = usage.Process + 1},
            UsageKind.Other => usage with {Other = usage.Other + 1},
            _ => usage with {Other = usage.Other + 1}
        };

        // Update contact
        await entityService.ContactSetAsync(
            new ContactPointer(userEntity.Id, "signalco", contactName),
            JsonSerializer.Serialize(usage),
            cancellationToken: cancellationToken,
            doNotProcess: true,
            doNotNotify: true,
            doNotCache: true);
    }
}