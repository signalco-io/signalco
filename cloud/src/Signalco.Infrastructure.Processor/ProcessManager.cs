using Signal.Core.Contacts;
using Signal.Core.Entities;
using Signal.Core.Extensions;
using Signal.Core.Processor;
using Signal.Core.Storage;
using Signalco.Infrastructure.Processor.Configuration.Schemas;

namespace Signalco.Infrastructure.Processor;

internal class ProcessManager(
    Lazy<IEntityService> entityService,
    Lazy<IAzureStorage> storage,
    Lazy<IAzureStorageDao> dao,
    Lazy<IProcessor> processor,
    Lazy<IProcessService> processService)
    : IProcessManager
{
    public async Task AddAsync(
        IContactPointer pointer,
        CancellationToken cancellationToken = default)
    {
        var processLinks = await dao.Value.ContactLinkProcessTriggersAsync(pointer, cancellationToken);

        // Skip queue for some triggers
        if (pointer.ChannelName is
            "philipshue" or
            "zigbee2mqtt" or
            "samsung")
        {
            await Task.WhenAll(processLinks
                .Select(link => processor.Value.RunProcessAsync(link.ProcessEntityId, cancellationToken)));
        }
        else
        {
            await Task.WhenAll(processLinks
                .Select(link => this.QueueAsync(link.ProcessEntityId, cancellationToken)));
        }
    }

    public Task AddManualAsync(string processEntityId, CancellationToken cancellationToken = default) =>
        this.QueueAsync(processEntityId, cancellationToken);

    public Task FromQueueAsync(string processEntityId, CancellationToken cancellationToken = default) =>
        processor.Value.RunProcessAsync(processEntityId, cancellationToken);

    public async Task LinkContactProcessTriggers(
        IContactPointer pointer,
        CancellationToken cancellationToken = default)
    {
        // Ignore if not for this cache (only configuration changes are cached here)
        var entityId = pointer.EntityId;
        if (pointer.ChannelName != "signalco" ||
            pointer.ContactName != "configuration")
            return;

        // Ignore if not Process
        var entity = await entityService.Value.GetInternalAsync(entityId, cancellationToken);
        if (entity is not {Type: EntityType.Process})
            return;

        // Clear old links to process
        await storage.Value.RemoveContactLinksProcessTriggersAsync(entityId, cancellationToken);

        // Resolve triggers from configuration
        var config = await processService.Value.GetConfigurationAsync(entityId, cancellationToken);
        var triggers = ConditionsHelper
            .ExtractPointers(
                config?.Conducts?.SelectMany(cc => cc.Conditions ?? Enumerable.Empty<Condition>()) ??
                Enumerable.Empty<Condition>())
            .Where(cp => cp != null)
            .Select(cp => cp!);

        // Making sure all pointers are owned by entity user
        // Retrieve all users connected with the process
        // Retrieve all entities connected to users to check which are allowed
        var processUsers = (await entityService.Value.EntityUsersAsync(new[] { entityId }, cancellationToken)).SelectMany(eu => eu.Value);
        var entities = await processUsers.SelectManyAsync(userId =>
            entityService.Value.AllAsync(userId, null, cancellationToken));
        var entityIds = entities.Select(e => e.Id);

        // Assign process to all triggers (which are entities assigned to process users) from configuration
        await Task.WhenAll(triggers
            .Where(t => entityIds.Contains(t.EntityId))
            .Select(triggerPointer =>
            storage.Value.UpsertAsync(
                new ContactLinkProcessTriggerItem(triggerPointer, entityId),
                cancellationToken)));
    }

    private async Task QueueAsync(string processEntityId, CancellationToken cancellationToken = default) =>
        await storage.Value.QueueAsync(
            new ContactStateProcessQueueItem(processEntityId),
            cancellationToken);
}