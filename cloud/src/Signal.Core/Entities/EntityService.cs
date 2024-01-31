using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Signal.Core.Contacts;
using Signal.Core.Exceptions;
using Signal.Core.Notifications;
using Signal.Core.Processor;
using Signal.Core.Sharing;
using Signal.Core.Storage;

namespace Signal.Core.Entities;

internal class EntityService(
    ISharingService sharingService,
    IAzureStorageDao storageDao,
    IAzureStorage storage,
    IProcessManager processManager,
    ISignalRService signalRService) : IEntityService
{
    private readonly ISharingService sharingService =
        sharingService ?? throw new ArgumentNullException(nameof(sharingService));

    private readonly IAzureStorageDao storageDao = storageDao ?? throw new ArgumentNullException(nameof(storageDao));
    private readonly IAzureStorage storage = storage ?? throw new ArgumentNullException(nameof(storage));

    private readonly IProcessManager processManager =
        processManager ?? throw new ArgumentNullException(nameof(processManager));

    private readonly ISignalRService signalRService =
        signalRService ?? throw new ArgumentNullException(nameof(signalRService));

    public async Task<IReadOnlyDictionary<string, IEnumerable<string>>> EntityUsersAsync(
        IEnumerable<string> entityIds,
        CancellationToken cancellationToken = default) =>
        // TODO: Persist entity users in entity property, use assigned entities table only as cache
        await this.storageDao.AssignedUsersAsync(
            entityIds,
            cancellationToken);

    public async Task<IEnumerable<IEntity>> AllAsync(
        string userId,
        IEnumerable<EntityType>? types = null,
        CancellationToken cancellationToken = default) =>
        await this.storageDao.UserEntitiesAsync(userId, types, cancellationToken);

    public async Task<IEnumerable<IEntityDetailed>> AllDetailedAsync(
        string userId,
        IEnumerable<EntityType>? types = null,
        CancellationToken cancellationToken = default) =>
        await this.storageDao.UserEntitiesDetailedAsync(userId, types, cancellationToken);

    public async Task<IEntityDetailed?> GetDetailedAsync(string userId, string entityId,
        CancellationToken cancellationToken = default)
    {
        var assignedTask = this.IsUserAssignedAsync(userId, entityId, cancellationToken);
        var getTask = this.storageDao.GetDetailedAsync(entityId, cancellationToken);

        await Task.WhenAll(assignedTask, getTask);
        return !assignedTask.Result ? null : getTask.Result;
    }

    public async Task<IEntity?> GetInternalAsync(string entityId, CancellationToken cancellationToken = default) =>
        await this.storageDao.GetAsync(entityId, cancellationToken);

    public async Task<string> UpsertAsync(string userId, string? entityId, Func<string, IEntity> entityFunc,
        CancellationToken cancellationToken = default)
    {
        // Check if existing entity was requested but not assigned
        var exists = false;
        if (entityId != null)
        {
            exists = await this.storageDao.EntityExistsAsync(entityId, cancellationToken);
            var isAssigned = await this.storageDao.IsUserAssignedAsync(
                userId, entityId, cancellationToken);

            if (exists && !isAssigned)
                throw new ExpectedHttpException(HttpStatusCode.NotFound);
        }

        // Create entity
        var id = entityId ?? await this.GenerateEntityIdAsync(cancellationToken);
        await this.storage.UpsertAsync(
            entityFunc(id),
            cancellationToken);

        // Assign to user if creating entity
        if (!exists)
        {
            await this.sharingService.AssignToUserAsync(
                userId,
                id,
                cancellationToken);
        }

        return id;
    }

    public async Task<IContact?> ContactAsync(IContactPointer pointer, CancellationToken cancellationToken = default) =>
        await this.storageDao.ContactAsync(pointer, cancellationToken);

    public async Task<IEnumerable<IContact>?> ContactsAsync(string entityId,
        CancellationToken cancellationToken = default) =>
        await this.storageDao.ContactsAsync(entityId, cancellationToken);

    public async Task<IEnumerable<IContact?>> ContactsAsync(
        IEnumerable<IContactPointer> pointers,
        CancellationToken cancellationToken = default) =>
        await Task.WhenAll(pointers.Select(p => this.ContactAsync(p, cancellationToken)));

    public async Task<IEnumerable<IContact>?> ContactsAsync(IEnumerable<string> entityIds,
        CancellationToken cancellationToken = default) =>
        await this.storageDao.ContactsAsync(entityIds, cancellationToken);

    public async Task ContactSetMetadataAsync(
        IContactPointer pointer,
        string? metadata,
        CancellationToken cancellationToken = default)
    {
        var contact = await this.ContactAsync(pointer, cancellationToken);
        if (contact == null)
            throw new ExpectedHttpException(HttpStatusCode.NotFound);

        await this.storage.UpsertAsync(
            new Contact(
                contact.EntityId,
                contact.ChannelName,
                contact.ContactName,
                contact.ValueSerialized,
                contact.TimeStamp,
                metadata),
            cancellationToken);
    }

    public async Task ContactSetAsync(
        IContactPointer pointer,
        string? valueSerialized,
        DateTime? timeStamp = null,
        CancellationToken cancellationToken = default,
        bool doNotProcess = false)
    {
        try
        {
            var persistHistory = false;
            var contact = await this.ContactAsync(pointer, cancellationToken);
            if (contact != null)
            {
                var contactMetadata1 = contact.ReadMetadata<ContactMetadataV1>();

                // Retrieve persistHistory flag
                persistHistory = contactMetadata1?.PersistHistory ?? false;

                // Handle ignore same value flag
                if (!(contactMetadata1?.ProcessSameValue ?? false) &&
                    contact.ValueSerialized == valueSerialized)
                    return;
            }

            // Persist as current state
            var updateCurrentStateTask = this.storage.UpsertAsync(
                new Contact(
                    pointer.EntityId,
                    pointer.ChannelName,
                    pointer.ContactName,
                    valueSerialized,
                    timeStamp ?? DateTime.UtcNow,
                    contact?.Metadata),
                cancellationToken);

            // Persist history only if given contact is marked for history tracking
            var persistHistoryTask = persistHistory
                ? this.storage.UpsertAsync(
                    new ContactHistoryItem(
                        pointer,
                        valueSerialized,
                        timeStamp ?? DateTime.UtcNow),
                    cancellationToken)
                : Task.CompletedTask;

            // Wait for current state update before triggering notification
            await Task.WhenAll(
                persistHistoryTask,
                updateCurrentStateTask);

            // Notify listeners
            var notifyStateChangeTask = this.BroadcastToEntityUsersAsync(
                pointer.EntityId,
                "contacts",
                "contact",
                new object[]
                {
                    JsonSerializer.Serialize(new ContactValueChangedDto(
                        pointer.EntityId,
                        pointer.ContactName,
                        pointer.ChannelName,
                        valueSerialized,
                        timeStamp ?? DateTime.UtcNow))
                },
                cancellationToken);

            // Processing
            var queueStateProcessingTask = Task.CompletedTask;
            if (!doNotProcess)
                queueStateProcessingTask = this.processManager.AddAsync(pointer, cancellationToken);

            // Caching
            var cacheTask = this.CacheEntityAsync(pointer, cancellationToken);

            // Wait for all to finish
            await Task.WhenAll(
                notifyStateChangeTask,
                queueStateProcessingTask,
                cacheTask);
        }
        catch
        {
            // TODO: Log
        }
    }

    public async Task ContactDeleteAsync(
        string userId,
        IContactPointer pointer,
        CancellationToken cancellationToken = default)
    {
        // Validate assignment
        if (!(await this.IsUserAssignedAsync(userId, pointer.EntityId, cancellationToken)))
            throw new ExpectedHttpException(HttpStatusCode.NotFound);

        // TODO: Check if user is owner

        // Delete contact and history
        await this.storage.RemoveAsync(pointer, cancellationToken);
    }

    private async Task CacheEntityAsync(IContactPointer pointer, CancellationToken cancellationToken = default)
    {
        // NOTE: Implementation checks whether given contact is appropriate to be cached
        await this.processManager.LinkContactProcessTriggers(pointer, cancellationToken);
    }

    private async Task<string> GenerateEntityIdAsync(CancellationToken cancellationToken = default)
    {
        var newId = Guid.NewGuid().ToString();
        while (await this.storageDao.EntityExistsAsync(newId, cancellationToken))
            newId = Guid.NewGuid().ToString();
        return newId;
    }

    public async Task RemoveAsync(string userId, string entityId, CancellationToken cancellationToken = default)
    {
        // Validate assigned
        if (!(await this.IsUserAssignedAsync(userId, entityId, cancellationToken)))
            throw new ExpectedHttpException(HttpStatusCode.NotFound);

        // TODO: Check if user is owner (only owner can delete entity)

        // Remove assignments for all users (since entity doesn't exist anymore)
        var entityUsers = (await this.storageDao.AssignedUsersAsync(new[] {entityId}, cancellationToken))[entityId];
        var assignmentsDeleteTask = Task.WhenAll(entityUsers.Select(u =>
            this.sharingService.UnAssignFromUserAsync(u, entityId, cancellationToken)));

        // Remove all contacts
        Task? contactsDeleteTask = null;
        var contacts = await this.storageDao.ContactsAsync(entityId, cancellationToken);
        if (contacts != null)
        {
            contactsDeleteTask = Task.WhenAll(contacts.Select(c =>
                this.ContactDeleteAsync(
                    userId,
                    new ContactPointer(entityId, c.ChannelName, c.ContactName),
                    cancellationToken)));
        }

        // Wait for all to finish
        await Task.WhenAll(
            contactsDeleteTask ?? Task.CompletedTask,
            assignmentsDeleteTask);

        // Remove entity
        await this.storage.RemoveEntityAsync(entityId, cancellationToken);
    }

    public Task<bool> IsUserAssignedAsync(string userId, string id, CancellationToken cancellationToken = default) =>
        this.storageDao.IsUserAssignedAsync(userId, id, cancellationToken);

    public async Task BroadcastToEntityUsersAsync(
        string entityId,
        string hubName,
        string target,
        object[] arguments,
        CancellationToken cancellationToken = default)
    {
        var entityUsers = await this.EntityUsersAsync(new[] {entityId}, cancellationToken);
        await this.signalRService.SendToUsersAsync(
            entityUsers[entityId].ToList(),
            hubName,
            target,
            arguments,
            cancellationToken);
    }
}