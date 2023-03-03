using System;
using System.Linq;
using System.Net;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Azure.WebJobs;
using Microsoft.Extensions.Logging;
using Signal.Core.Contacts;
using Signal.Core.Entities;
using Signal.Core.Exceptions;
using Signal.Core.Processor;
using Signal.Core.Usage;

namespace Signal.Api.Internal.Functions
{
    public class UsageProcessTrigger
    {
        private readonly IEntityService entityService;

        public UsageProcessTrigger(
            IEntityService entityService)
        {
            this.entityService = entityService ?? throw new ArgumentNullException(nameof(entityService));
        }

        [FunctionName("UsageProcessTrigger")]
        public async Task Run(
            [QueueTrigger("usage-processing", Connection = "SignalcoStorageAccountConnectionString")]
            string item,
            ILogger logger,
            CancellationToken cancellationToken = default)
        {
            var queueItem = JsonSerializer.Deserialize<UsageQueueItem>(item) ??
                            throw new ExpectedHttpException(HttpStatusCode.BadRequest, "Invalid queue item data");

            logger.LogInformation("Dequeued usage item: {@UsageItem}", queueItem);

            // TODO: Move to service
            // Retrieve or create user entity
            var userEntity = (await this.entityService.AllDetailedAsync(queueItem.UserId, new[] {EntityType.User}, cancellationToken)).FirstOrDefault();
            if (userEntity == null)
            {
                var userEntityId = await this.entityService.UpsertAsync(
                    queueItem.UserId,
                    null,
                    id => new Entity(EntityType.User, id, "Me"),
                    cancellationToken);
                userEntity = await this.entityService.GetDetailedAsync(queueItem.UserId, userEntityId, cancellationToken);
            }

            if (userEntity == null)
                throw new Exception("Unexpected entity");
            
            // Calculate updated usage
            var now = DateTime.UtcNow;
            var contactName = $"usage-{now.Year}{now.Month:D2}{now.Day:D2}";
            var currentUsageValueSerialized = userEntity.Contacts.FirstOrDefault(c => 
                c.ChannelName == "signalco" && c.ContactName == contactName)?.ValueSerialized;
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
            await this.entityService.ContactSetAsync(
                new ContactPointer(userEntity.Id, "signalco", contactName),
                JsonSerializer.Serialize(usage), 
                cancellationToken: cancellationToken,
                persistHistory: false);
        }
    }
}
