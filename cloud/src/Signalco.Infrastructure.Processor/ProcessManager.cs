using Signal.Core.Contacts;
using Signal.Core.Entities;
using Signal.Core.Extensions;
using Signal.Core.Processor;
using Signal.Core.Storage;
using Signalco.Infrastructure.Processor.Configuration.Schemas;
using ContactPointer = Signal.Core.Contacts.ContactPointer;

namespace Signalco.Infrastructure.Processor;

internal class ProcessManager : IProcessManager
{
    private readonly Lazy<IEntityService> entityService;
    private readonly Lazy<IAzureStorage> storage;
    private readonly Lazy<IAzureStorageDao> dao;
    private readonly Lazy<IProcessor> processor;
    private readonly Lazy<IProcessService> processService;

    public ProcessManager(
        Lazy<IEntityService> entityService,
        Lazy<IAzureStorage> storage,
        Lazy<IAzureStorageDao> dao,
        Lazy<IProcessor> processor,
        Lazy<IProcessService> processService)
    {
        this.entityService = entityService ?? throw new ArgumentNullException(nameof(entityService));
        this.storage = storage ?? throw new ArgumentNullException(nameof(storage));
        this.dao = dao ?? throw new ArgumentNullException(nameof(dao));
        this.processor = processor ?? throw new ArgumentNullException(nameof(processor));
        this.processService = processService ?? throw new ArgumentNullException(nameof(processService));
    }

    public async Task AddAsync(
        IContactPointer pointer,
        CancellationToken cancellationToken = default)
    {
        // Skip queue for some triggers
        if (pointer.ChannelName is
                "philipshue" or
                "zigbee2mqtt" or
                "samsung")
        {
            await this.InstantInternalAsync(pointer, true, cancellationToken);
        }
        else
        {
            await this.QueueAsync(pointer, cancellationToken);
        }
    }

    public Task FromQueueAsync(IContactPointer pointer, CancellationToken cancellationToken = default) =>
        this.InstantInternalAsync(pointer, false, cancellationToken);

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
        var entity = await this.entityService.Value.GetInternalAsync(entityId, cancellationToken);
        if (entity is not {Type: EntityType.Process})
            return;

        // Clear old links to process
        await this.storage.Value.RemoveContactLinksProcessTriggersAsync(entityId, cancellationToken);

        // Resolve triggers from configuration
        var config = await this.processService.Value.GetConfigurationAsync(entityId, cancellationToken);
        var triggers = ConditionsHelper
            .ExtractPointers(
                config?.Conducts?.SelectMany(cc => cc.Conditions ?? Enumerable.Empty<Condition>()) ??
                Enumerable.Empty<Condition>())
            .Where(cp => cp != null)
            .Select(cp => cp!);

        // Making sure all pointers are owned by entity user
        // Retrieve all users connected with the process
        // Retrieve all entities connected to users to check which are allowed
        var processUsers = (await this.entityService.Value.EntityUsersAsync(new[] { entityId }, cancellationToken)).SelectMany(eu => eu.Value);
        var entities = await processUsers.SelectManyAsync(userId =>
            this.entityService.Value.AllAsync(userId, null, cancellationToken));
        var entityIds = entities.Select(e => e.Id);

        // Assign process to all triggers (which are entities assigned to process users) from configuration
        await Task.WhenAll(triggers
            .Where(t => entityIds.Contains(t.EntityId))
            .Select(triggerPointer =>
            this.storage.Value.UpsertAsync(
                new ContactLinkProcessTriggerItem(triggerPointer, entityId),
                cancellationToken)));
    }

    private async Task QueueAsync(IContactPointer pointer, CancellationToken cancellationToken = default)
    {
        await this.storage.Value.QueueAsync(
            new ContactStateProcessQueueItem(
                new ContactPointer(
                    pointer.EntityId,
                    pointer.ChannelName,
                    pointer.ContactName)),
            cancellationToken);
    }

    private async Task InstantInternalAsync(IContactPointer pointer, bool instant, CancellationToken cancellationToken = default)
    {
        var processLinks = await this.dao.Value.ContactLinkProcessTriggersAsync(pointer, cancellationToken);
        await Task.WhenAll(processLinks
            .Select(link => this.processor.Value.RunProcessAsync(link.ProcessEntityId, pointer, instant, cancellationToken)));
    }
}