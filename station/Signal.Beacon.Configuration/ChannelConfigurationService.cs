using System;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Signal.Beacon.Core.Configuration;
using Signal.Beacon.Core.Entity;

namespace Signal.Beacon.Configuration;

public class ChannelConfigurationService : IChannelConfigurationService
{
    private readonly IEntityService entityService;
    private readonly IEntitiesDao entitiesDao;
    private readonly ILogger<ChannelConfigurationService> logger;

    public ChannelConfigurationService(
        IEntityService entityService,
        IEntitiesDao entitiesDao,
        ILogger<ChannelConfigurationService> logger)
    {
        this.entityService = entityService ?? throw new ArgumentNullException(nameof(entityService));
        this.entitiesDao = entitiesDao ?? throw new ArgumentNullException(nameof(entitiesDao));
        this.logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    private async Task MigrateLocalToCloudAsync(string entityId, string channelName, CancellationToken cancellationToken = default)
    {
        var absolutePath = Path.Combine(
            Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
            "SignalBeacon",
            "config");
        var localConfigs = Directory.GetFiles(absolutePath);
        var matchedLocalConfigPath = localConfigs
            .Where(lcp => Path.GetFileNameWithoutExtension(lcp).ToLowerInvariant() == channelName)
            .ToList();
        if (matchedLocalConfigPath.Any())
        {
            foreach (var localConfigAbsolutePath in matchedLocalConfigPath)
            {
                this.logger.LogInformation("Found local configuration at {Path}. Migrating...", localConfigAbsolutePath);

                await this.entityService.ContactSetAsync(
                    new ContactPointer(entityId, channelName, KnownContacts.ChannelStationConfiguration),
                    await File.ReadAllTextAsync(localConfigAbsolutePath, cancellationToken),
                    cancellationToken);
                File.Delete(localConfigAbsolutePath);
            }
        }
    }

    public async Task<T> LoadAsync<T>(string entityId, string channelName, CancellationToken cancellationToken = default) where T : new()
    {
        await this.MigrateLocalToCloudAsync(entityId, channelName, cancellationToken);

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