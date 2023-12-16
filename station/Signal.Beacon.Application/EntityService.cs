using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Signal.Beacon.Application.PubSub;
using Signal.Beacon.Application.Signal.Client.Contact;
using Signal.Beacon.Application.Signal.Client.Entity;
using Signal.Beacon.Core.Entity;

namespace Signal.Beacon.Application;

internal class EntityService : IEntityService
{
    private readonly IEntitiesDao entitiesDao;
    private readonly ISignalcoContactClient contactClient;
    private readonly ISignalcoEntityClient entityClient;
    private readonly IPubSubHub<IContactPointer> contactHub;
    private readonly ILogger<EntityService> logger;

    public EntityService(
        IEntitiesDao entitiesDao,
        ISignalcoContactClient contactClient,
        ISignalcoEntityClient entityClient,
        IPubSubHub<IContactPointer> contactHub,
        ILogger<EntityService> logger)
    {
        this.entitiesDao = entitiesDao ?? throw new ArgumentNullException(nameof(entitiesDao));
        this.contactClient = contactClient ?? throw new ArgumentNullException(nameof(contactClient));
        this.entityClient = entityClient ?? throw new ArgumentNullException(nameof(entityClient));
        this.contactHub = contactHub ?? throw new ArgumentNullException(nameof(contactHub));
        this.logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<string> UpsertAsync(EntityType type, string? id, string alias, CancellationToken cancellationToken = default) => 
        await this.entityClient.UpsertAsync(new EntityUpsertCommand(id, type, alias), cancellationToken);

    public async Task ContactSetAsync(IContactPointer pointer, string? valueSerialized, CancellationToken cancellationToken = default)
    {
        // Retrieve device
        var entity = await this.entitiesDao.GetAsync(pointer.EntityId, cancellationToken);
        if (entity == null)
        {
            this.logger.LogDebug("Entity with identifier not found {EntityId} {Contact}: {ValueSerialized}. State ignored",
                pointer.EntityId,
                pointer.ContactName,
                valueSerialized);
            return;
        }

        // Ignore if value didn't change, don't ignore for actions
        // TODO: Implement as before for actions
        var contact = entity.Contact(pointer);
        if (contact != null)
        {
            var currentState = contact.ValueSerialized;
            var oldAndNewNull = currentState == null && valueSerialized == null;
            var isActionOrStringOrEnum = true; // contact.DataType is "action" or "string" or "enum";
            var areEqual = currentState?.Equals(valueSerialized) ?? false;
            var areEqualValues = currentState == valueSerialized;
            if (oldAndNewNull ||
                !isActionOrStringOrEnum && (areEqual || areEqualValues))
            {
                this.logger.LogDebug(
                    "Contact {Pointer}: {ValueSerialized} (unchanged)",
                    pointer,
                    valueSerialized);
                return;
            }
        }

        // Apply noise reducing delta
        // TODO: Re-implement noise reduction
        //if (contact.DataType == "double" && 
        //    contact.NoiseReductionDelta.HasValue)
        //{
        //    var currentValueDouble = ParseValueDouble(currentState);
        //    var setValueDouble = ParseValueDouble(setValue);
        //    if (currentValueDouble != null &&
        //        setValueDouble != null &&
        //        Math.Abs(currentValueDouble.Value - setValueDouble.Value) <= contact.NoiseReductionDelta.Value)
        //    {
        //        this.logger.LogTrace(
        //            "Device contact noise reduction threshold not reached. State ignored. {EntityId} {Contact}: {Value}",
        //            pointer.Identifier,
        //            pointer.Contact,
        //            setValue);
        //        return;
        //    }
        //}

        // Publish state changed to local workers
        await this.contactHub.PublishAsync(new[] { pointer }, cancellationToken);

        // Publish state changed to Signal API
        try
        {
            var timeStamp = DateTime.UtcNow;

            this.logger.LogDebug(
                "Contact {Pointer}: {OldValue} -> {ValueSerialized}",
                pointer,
                contact?.ValueSerialized,
                valueSerialized);

            // Update local value (if contact exists)
            contact?.UpdateLocalValue(valueSerialized, timeStamp);

            await this.contactClient.UpsertAsync(
                new ContactUpsertCommand(
                    entity.Id, pointer.ChannelName, pointer.ContactName, valueSerialized, timeStamp, contact == null),
                cancellationToken);
        }
        catch (Exception ex) when (ex.Message.Contains("IDX10223"))
        {
            this.logger.LogWarning("Failed to push contact update to cloud - Token expired. Contact {Pointer} to \"{ValueSerialized}\"",
                pointer, valueSerialized);
        }
        catch (Exception ex)
        {
            this.logger.LogWarning(
                ex,
                "Failed to push contact update to cloud - Unknown error. Contact {Pointer} to \"{ValueSerialized}\"",
                pointer, valueSerialized);
        }
    }
}