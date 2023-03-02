using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Signal.Beacon.Core.Entity;
using Signal.Beacon.Core.Signal;

namespace Signal.Beacon.Application.Signal.Client.Entity;

internal class EntitiesDao : IEntitiesDao
{
    private readonly ISignalcoEntityClient entitiesClient;
    private readonly ILogger<EntitiesDao> logger;
    private Dictionary<string, IEntityDetails?>? entities;
    private readonly object cacheLock = new();
    private Task<IEnumerable<IEntityDetails>>? getEntitiesTask;

    public EntitiesDao(
        ISignalcoEntityClient devicesClient,
        ILogger<EntitiesDao> logger)
    {
        this.entitiesClient = devicesClient ?? throw new ArgumentNullException(nameof(devicesClient));
        this.logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<IEntityDetails?> GetByAliasAsync(string alias, CancellationToken cancellationToken)
    {
        await this.CacheEntitiesAsync(cancellationToken);

        return this.entities?.Values.FirstOrDefault(d => d?.Alias == alias);
    }

    public async Task<IEntityDetails?> GetAsync(string id, CancellationToken cancellationToken = default)
    {
        await this.CacheEntityAsync(id, cancellationToken);

        if (this.entities != null && this.entities.TryGetValue(id, out var device))
            return device;
        return null;
    }

    public async Task<IEnumerable<IEntityDetails>> GetByContactValueAsync(
        string channelName, 
        string contactName,
        string? contactValueSerialized, 
        CancellationToken cancellationToken = default)
    {
        await this.CacheEntitiesAsync(cancellationToken);

        return this.entities?.Values
                   .Where(e =>
                       e != null &&
                       e.Contact(channelName, contactName)?.ValueSerialized == contactValueSerialized)
                   .Select(e => e!)
               ?? Enumerable.Empty<IEntityDetails>();
    }

    public async Task<IEnumerable<IEntityDetails>> AllAsync(CancellationToken cancellationToken = default)
    {
        await this.CacheEntitiesAsync(cancellationToken);
        
        return this.entities?.Values
                   .AsEnumerable()
                   .Where(e => e != null)
                   .Select(e => e!) ??
               Enumerable.Empty<IEntityDetails>();
    }

    public async Task<string?> ContactValueSerializedAsync(IContactPointer pointer, CancellationToken cancellationToken) =>
        (await this.GetAsync(pointer.EntityId, cancellationToken))?.Contact(pointer)?.ValueSerialized;

    public void InvalidateEntity(string id)
    {
        lock (this.cacheLock)
        {
            if (!(this.entities?.ContainsKey(id) ?? false))
                return;
            if (this.entities[id] == null)
                return;

            this.entities[id] = null;
            this.logger.LogDebug("Entity {Id} cache invalidated", id);
        }
    }

    private async Task CacheEntitiesAsync(CancellationToken cancellationToken = default)
    {
        if (this.entities != null)
        {
            // Check if we need to pull single entities
            foreach (var (id, _) in this.entities.Where(d => d.Value == null))
            {
                await this.CacheEntityAsync(id, cancellationToken);
            }
        }

        try
        {
            this.getEntitiesTask ??= this.entitiesClient.AllAsync(cancellationToken);

            var remoteEntities = (await this.getEntitiesTask).ToList();

            lock (this.cacheLock)
            {
                if (this.entities != null)
                    return;

                try
                {
                    this.entities = new Dictionary<string, IEntityDetails?>();
                    foreach (var entity in remoteEntities)
                    {
                        this.entities.Add(entity.Id, entity);

                        //// Set local state
                        //if (this.deviceStateManager.Value is EntityContactManager localDeviceStateManager)
                        //    foreach (var retrievedState in deviceConfiguration.States)
                        //        localDeviceStateManager.SetLocalState(
                        //            retrievedState.contact with { Identifier = deviceConfiguration.Identifier },
                        //            retrievedState.value);
                    }

                    this.logger.LogDebug("Entities cache renewed");
                }
                finally
                {
                    this.getEntitiesTask = null;
                }
            }
        }
        catch (Exception ex)
        {
            this.logger.LogDebug(ex, "Cache entities from SignalcoAPI failed.");
            this.logger.LogWarning("Failed to load entities from Signalco.");
        }
    }

    private async Task CacheEntityAsync(string id, CancellationToken cancellationToken)
    {
        if (this.entities == null)
        {
            await this.CacheEntitiesAsync(cancellationToken);
            return;
        }

        if (this.entities.ContainsKey(id) && this.entities[id] != null)
            return;

        this.entities[id] = await this.entitiesClient.GetAsync(id, cancellationToken);
        this.logger.LogDebug("Entity {Id} cache renewed", id);
    }
}