using System.Globalization;
using System.Text.Json;
using Microsoft.Extensions.Logging;
using Refit;
using Signal.Beacon.Core.Entity;
using Signal.Beacon.Core.Workers;

namespace Signalco.Station.Channel.Shelly;

internal class ShellyWorkerService : IWorkerService
{
    private readonly IEntitiesDao entitiesDao;
    private readonly IEntityService entityService;
    private readonly ILogger<ShellyWorkerService> logger;
    private readonly CancellationTokenSource cts = new();

    public ShellyWorkerService(
        IEntitiesDao entitiesDao,
        IEntityService entityService,
        ILogger<ShellyWorkerService> logger)
    {
        this.entitiesDao = entitiesDao;
        this.entityService = entityService;
        this.logger = logger;
    }

    public async Task StartAsync(string entityId, CancellationToken cancellationToken)
    {
        var devices = (await this.entitiesDao.AllAsync(cancellationToken))
            .Where(e => e.Type == EntityType.Device && e.Contacts.Any(c => c.ChannelName == ShellyChannels.Shelly))
            .ToList();

        foreach (var device in devices) 
            _ = this.StartDeviceAsync(device, cancellationToken);
    }

    private async Task StartDeviceAsync(IEntityDetails entity, CancellationToken cancellationToken)
    {
        var configurationJson = entity.Contact(ShellyChannels.Shelly, "configuration")?.ValueSerialized;
        if (string.IsNullOrWhiteSpace(configurationJson))
        {
            this.logger.LogWarning("Entity {EntityId} doesn't have valid configuration. Please finish discovery for device first.", entity.Id);
            return;
        }

        var configuration = JsonSerializer.Deserialize<ShellyDeviceConfiguration>(configurationJson);
        if (string.IsNullOrWhiteSpace(configuration?.IpAddress))
        {
            this.logger.LogWarning("Entity {EntityId} has invalid configuration. Please re-configure the device first.", entity.Id);
            return;
        }

        var pollingInterval = configuration.PollingInterval.HasValue
            ? TimeSpan.FromMilliseconds(Math.Max(1000, configuration.PollingInterval.Value))
            : TimeSpan.FromSeconds(30);

        try
        {
            var entityApiAddress = $"http://{configuration.IpAddress}/";
            var client = RestService.For<Shelly3emApiClient>(entityApiAddress);

            while (!this.cts.Token.IsCancellationRequested)
            {
                var status = await client.GetStatusAsync();
                for (var i = 0; i < status.Emeters?.Count; i++)
                {
                    var meterStatus = status.Emeters[i];
                    await this.entityService.ContactSetAsync(
                        new ContactPointer(entity.Id, ShellyChannels.Shelly, $"meter-{i}-power"),
                        meterStatus.Power.ToString(CultureInfo.InvariantCulture), cancellationToken);
                }

                await Task.Delay(pollingInterval, cancellationToken);
            }
        }
        catch (Exception ex)
        {
            this.logger.LogWarning(ex, "Failed to retrieve status for entity {EntityId}", entity.Id);
        }
    }

    public Task StopAsync()
    {
        this.cts.Cancel();
        return Task.CompletedTask;
    }
}