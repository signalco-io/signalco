using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Refit;
using Signal.Beacon.Core.Entity;
using Signal.Beacon.Core.Workers;

namespace Signalco.Station.Channel.Shelly;

internal static class ShellyChannels
{
    public const string Shelly = "shelly";
}

public static class ShellyWorkerServiceCollectionExtensions
{
    public static IServiceCollection AddShelly(this IServiceCollection services) =>
        services
            .AddTransient<IWorkerServiceRegistration, ShellyWorkerServiceRegistration >()
            .AddTransient<ShellyWorkerService>();
}

internal sealed class ShellyWorkerServiceRegistration : IWorkerServiceRegistration
{
    public string ChannelName => ShellyChannels.Shelly;

    public Type WorkerServiceType => typeof(ShellyWorkerService);
}

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
        if (string.IsNullOrWhiteSpace(configuration.IpAddress))
        {
            this.logger.LogWarning("Entity {EntityId} has invalid configuration. Please re-configure the device first.", entity.Id);
            return;
        }

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
                        meterStatus.Power.ToString(), cancellationToken);
                }

                await Task.Delay(TimeSpan.FromSeconds(60), cancellationToken);
            }
        }
        catch (Exception ex)
        {
            this.logger.LogWarning(ex, "Failed to retrieve status for entity " + entity.Id);
        }
    }

    public Task StopAsync()
    {
        this.cts.Cancel();
        return Task.CompletedTask;
    }
}

internal interface Shelly3emApiClient
{
    [Get("/status")]
    Task<Shelly3emStatusDto> GetStatusAsync();
}

internal class Shelly3emStatusDto
{
    [JsonPropertyName("relays")] public List<Relay>? Relays { get; set; }

    [JsonPropertyName("emeters")] public List<Emeter>? Emeters { get; set; }

    [JsonPropertyName("total_power")] public double? TotalPower { get; set; }

    [JsonPropertyName("fs_mounted")] public bool? FsMounted { get; set; }

    public class Emeter
    {
        [JsonPropertyName("power")] public double Power { get; set; }

        [JsonPropertyName("pf")] public double Pf { get; set; }

        [JsonPropertyName("current")] public double Current { get; set; }

        [JsonPropertyName("voltage")] public double Voltage { get; set; }

        [JsonPropertyName("is_valid")] public bool IsValid { get; set; }

        [JsonPropertyName("total")] public double Total { get; set; }

        [JsonPropertyName("total_returned")] public double TotalReturned { get; set; }
    }

    public class Relay
    {
        [JsonPropertyName("ison")] public bool Ison { get; set; }

        [JsonPropertyName("has_timer")] public bool HasTimer { get; set; }

        [JsonPropertyName("timer_started")] public int TimerStarted { get; set; }

        [JsonPropertyName("timer_duration")] public int TimerDuration { get; set; }

        [JsonPropertyName("timer_remaining")] public int TimerRemaining { get; set; }

        [JsonPropertyName("overpower")] public bool Overpower { get; set; }

        [JsonPropertyName("is_valid")] public bool IsValid { get; set; }

        [JsonPropertyName("source")] public string Source { get; set; }
    }
}

internal class ShellyDeviceConfiguration
{
    public string IpAddress { get; set; }
}