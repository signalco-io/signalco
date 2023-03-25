using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Signal.Beacon.Core.Configuration;
using Signal.Beacon.Core.Entity;

namespace Signal.Beacon.Configuration;

public class ChannelConfigurationService : IChannelConfigurationService
{
    private readonly IEntityService entityService;
    private readonly IEntitiesDao entitiesDao;

    public ChannelConfigurationService(
        IEntityService entityService,
        IEntitiesDao entitiesDao)
    {
        this.entityService = entityService ?? throw new ArgumentNullException(nameof(entityService));
        this.entitiesDao = entitiesDao ?? throw new ArgumentNullException(nameof(entitiesDao));
    }

    public async Task<T> LoadAsync<T>(string entityId, string channelName, CancellationToken cancellationToken = default) where T : new()
    {
        var entity = await this.entitiesDao.GetAsync(entityId, cancellationToken);
        var contact = entity?.Contacts.FirstOrDefault(c =>
            c.ChannelName == channelName && c.ContactName == KnownContacts.ChannelStationConfiguration);
        if (string.IsNullOrWhiteSpace(contact?.ValueSerialized)) 
            return new T();

        var data = System.Text.Json.JsonSerializer.Deserialize<T>(contact.ValueSerialized);
        return data ?? new T();
    }

    public async Task SaveAsync<T>(string entityId, string channelName, T config, CancellationToken cancellationToken = default)
    {
        await this.entityService.ContactSetAsync(new ContactPointer(
                entityId,
                channelName,
                KnownContacts.ChannelStationConfiguration),
            System.Text.Json.JsonSerializer.Serialize(config),
            cancellationToken);
    }
}