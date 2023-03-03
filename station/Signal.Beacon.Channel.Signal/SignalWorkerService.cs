using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Signal.Beacon.Core.Conducts;
using Signal.Beacon.Core.Configuration;
using Signal.Beacon.Core.Entity;
using Signal.Beacon.Core.Mqtt;
using Signal.Beacon.Core.Workers;

namespace Signal.Beacon.Channel.Signal;

public class SignalWorkerService : IWorkerService
{
    private const string ConfigurationFileName = "Signal.json";

    private readonly IEntityService entityService;
    private readonly IEntitiesDao entitiesDao;
    private readonly IMqttClientFactory mqttClientFactory;
    private readonly IMqttDiscoveryService mqttDiscoveryService;
    private readonly IConfigurationService configurationService;
    private readonly IConductSubscriberClient conductSubscriberClient;
    private readonly ILogger<SignalWorkerService> logger;
    private readonly List<IMqttClient> clients = new();

    private SignalWorkerServiceConfiguration configuration = new();
    private CancellationToken startCancellationToken;

    public SignalWorkerService(
        IEntityService entityService,
        IEntitiesDao entitiesDao,
        IMqttClientFactory mqttClientFactory,
        IMqttDiscoveryService mqttDiscoveryService,
        IConfigurationService configurationService,
        IConductSubscriberClient conductSubscriberClient,
        ILogger<SignalWorkerService> logger)
    {
        this.entityService = entityService ?? throw new ArgumentNullException(nameof(entityService));
        this.entitiesDao = entitiesDao ?? throw new ArgumentNullException(nameof(entitiesDao));
        this.mqttClientFactory = mqttClientFactory ?? throw new ArgumentNullException(nameof(mqttClientFactory));
        this.mqttDiscoveryService = mqttDiscoveryService ?? throw new ArgumentNullException(nameof(mqttDiscoveryService));
        this.configurationService = configurationService ?? throw new ArgumentNullException(nameof(configurationService));
        this.conductSubscriberClient = conductSubscriberClient ?? throw new ArgumentNullException(nameof(conductSubscriberClient));
        this.logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }


    public async Task StartAsync(CancellationToken cancellationToken)
    {
        this.startCancellationToken = cancellationToken;
        this.startCancellationToken.Register(() => _ = this.StopAsync(CancellationToken.None));
        this.configuration =
            await this.configurationService.LoadAsync<SignalWorkerServiceConfiguration>(
                ConfigurationFileName,
                cancellationToken);

        if (this.configuration.Servers.Any())
            foreach (var mqttServerConfig in this.configuration.Servers.ToList())
                this.StartMqttClientAsync(mqttServerConfig);
        else
        {
            //this.DiscoverMqttBrokersAsync(cancellationToken);
        }

        this.conductSubscriberClient.Subscribe(SignalChannels.DeviceChannel, this.ConductHandler);
    }

    private async Task ConductHandler(IEnumerable<IConduct> conducts, CancellationToken cancellationToken)
    {
        foreach (var conduct in conducts)
        {
            try
            {
                var entityId = conduct.Pointer.EntityId;
                var entity = await this.entitiesDao.GetAsync(entityId, cancellationToken);
                if (entity == null)
                    throw new Exception($"Unknown entity {conduct.Pointer.EntityId}");

                var identifier = entity.Contact(SignalChannels.DeviceChannel, "identifier")?.ValueSerialized;
                if (string.IsNullOrWhiteSpace(identifier))
                    throw new Exception($"Entity not configured {entity?.Id}");
                
                var client = this.clients.FirstOrDefault();
                if (client != null)
                    await client.PublishAsync($"{conduct.Pointer.ChannelName}/{identifier}/{conduct.Pointer.ContactName}/set", conduct.ValueSerialized);
            }
            catch (Exception ex)
            {
                this.logger.LogTrace(ex, "Failed to execute conduct {@Conduct}", conduct);
                this.logger.LogWarning("Failed to execute conduct {@Conduct}", conduct);
            }
        }
    }

    private async void StartMqttClientAsync(SignalWorkerServiceConfiguration.MqttServer mqttServerConfig)
    {
        if (string.IsNullOrWhiteSpace(mqttServerConfig.Url))
        {
            this.logger.LogWarning("MQTT server URL not configured");
            return;
        }

        var clientName = $"Signalco.Station.Channel.Signalco.{Guid.NewGuid()}";
        var client = this.mqttClientFactory.Create();
        await client.StartAsync(clientName, mqttServerConfig.Url, this.startCancellationToken);
        await client.SubscribeAsync("signal/discovery/#", this.DiscoverDevicesAsync);
        this.clients.Add(client);

        this.logger.LogInformation("Started MQTT client {ClientName}", clientName);
    }

    private async Task DiscoverDevicesAsync(MqttMessage message)
    {
        var config = JsonSerializer.Deserialize<SignalDeviceConfig>(message.Payload);
        if (config == null)
        {
            this.logger.LogWarning("Device discovery message contains invalid configuration.");
            return;
        }

        var discoveryType = message.Topic.Split("/", StringSplitOptions.RemoveEmptyEntries).Last();
        if (discoveryType == "config")
        {
            try
            {
                // Signal new device discovered
                var identifier = config.MqttTopic;
                var name = config.Alias ?? (config.WifiHostname ?? identifier) ?? "Unknown";

                var entityId = (await this.entitiesDao.GetByContactValueAsync(
                    SignalChannels.DeviceChannel,
                    "identifier",
                    identifier, this.startCancellationToken)).FirstOrDefault()?.Id;
                if (entityId == null)
                {
                    entityId = await this.entityService.UpsertAsync(EntityType.Device, null, name, this.startCancellationToken);
                    await this.entityService.ContactSetAsync(
                        new ContactPointer(entityId, SignalChannels.DeviceChannel, "identifier"), identifier, this.startCancellationToken);
                }

                // Configure contacts if available in config
                if (config.Contacts != null)
                {
                    foreach (var configContact in config.Contacts)
                    {
                        try
                        {
                            if (configContact.Name != null &&
                                configContact.DataType != null)
                            {
                                await this.entityService.ContactSetAsync(
                                    new ContactPointer(entityId, SignalChannels.DeviceChannel, configContact.Name),
                                    null,
                                    this.startCancellationToken);
                            }
                        }
                        catch (Exception ex)
                        {
                            this.logger.LogTrace(ex, "Failed to update contact.");
                            this.logger.LogWarning("Failed to update contact {EntityId} {ContactName}", entityId, configContact.Name);
                        }
                    }
                }

                // Subscribe for device telemetry
                var telemetrySubscribeTopic = $"signal/{config.MqttTopic}/#";
                await message.Client.SubscribeAsync(telemetrySubscribeTopic,
                    msg => this.TelemetryHandlerAsync(entityId, msg));
            }
            catch (Exception ex)
            {
                this.logger.LogTrace(ex, "Failed to configure entity {Name} ({Identifier})",
                    config.WifiHostname, config.MqttTopic);
                this.logger.LogWarning("Failed to configure entity {Name} ({Identifier})",
                    config.WifiHostname, config.MqttTopic);
            }

            // Publish telemetry refresh request
            await message.Client.PublishAsync($"signal/{config.MqttTopic}/get", "get");
        }
    }

    private async Task TelemetryHandlerAsync(string entityId, MqttMessage message)
    {
        // Check topic
        var entity = await this.entitiesDao.GetAsync(entityId);
        var identifier = entity?.Contact(SignalChannels.DeviceChannel, "identifier")?.ValueSerialized;
        var isTelemetry = $"{SignalChannels.DeviceChannel}/{identifier}" == message.Topic;
        if (!isTelemetry)
            return;

        // Check contacts available
        var telemetry = JsonSerializer.Deserialize<SignalSensorTelemetryDto>(message.Payload);
        if (telemetry?.Contacts == null)
            return;

        // Process contacts
        foreach (var telemetryContact in telemetry.Contacts)
        {
            if (telemetryContact.ContactName != null)
            {
                await this.entityService.ContactSetAsync(
                    new ContactPointer(entityId, SignalChannels.DeviceChannel, telemetryContact.ContactName),
                    telemetryContact.Value?.ToString(), this.startCancellationToken);
            }
        }
    }

    private async void DiscoverMqttBrokersAsync(CancellationToken cancellationToken)
    {
        var availableBrokers =
            await this.mqttDiscoveryService.DiscoverMqttBrokerHostsAsync("signal/#", cancellationToken);
        foreach (var availableBroker in availableBrokers)
        {
            this.configuration.Servers.Add(new SignalWorkerServiceConfiguration.MqttServer
                { Url = availableBroker.IpAddress });
            await this.configurationService.SaveAsync(ConfigurationFileName, this.configuration, cancellationToken);
            this.StartMqttClientAsync(
                new SignalWorkerServiceConfiguration.MqttServer
                    {Url = availableBroker.IpAddress});
        }
    }
        
    public async Task StopAsync(CancellationToken cancellationToken)
    {
        this.logger.LogDebug("Stopping Signal worker service...");

        foreach (var mqttClient in this.clients) 
            await mqttClient.StopAsync(cancellationToken);
    }
}