using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Signal.Beacon.Core.Conducts;
using Signal.Beacon.Core.Configuration;
using Signal.Beacon.Core.Entity;
using Signal.Beacon.Core.Mqtt;
using Signal.Beacon.Core.Network;
using Signal.Beacon.Core.Workers;
using JsonSerializer = System.Text.Json.JsonSerializer;

namespace Signal.Beacon.Channel.Zigbee2Mqtt;

internal class Zigbee2MqttWorkerService : IWorkerService
{
    private const string MqttTopicSubscription = "zigbee2mqtt/#";
    private const string ConfigurationFileName = "Zigbee2mqtt.json"; // TODO: Remove when switched to cloud channel start
    private const int MqttClientStartRetryDelay = 10000;

    private readonly IEntitiesDao entitiesDao;
    private readonly IEntityService entityService;
    private readonly IConductSubscriberClient conductSubscriberClient;
    private readonly IMqttClientFactory mqttClientFactory;
    private readonly IConfigurationService configurationService;
    private readonly ILogger<Zigbee2MqttWorkerService> logger;

    private readonly CancellationTokenSource cts = new();

    private IMqttClient? client;
    private CancellationToken startCancellationToken = CancellationToken.None;

    private static readonly JsonSerializerOptions CaseInsensitiveOptions = new() { PropertyNameCaseInsensitive = true };
    private Zigbee2MqttWorkerServiceConfiguration.MqttServer? configuration;

    public Zigbee2MqttWorkerService(
        IEntitiesDao entitiesDao,
        IEntityService entityService,
        IConductSubscriberClient conductSubscriberClient,
        IMqttClientFactory mqttClientFactory,
        IConfigurationService configurationService,
        ILogger<Zigbee2MqttWorkerService> logger)
    {
        this.entitiesDao = entitiesDao ?? throw new ArgumentNullException(nameof(entitiesDao));
        this.entityService = entityService ?? throw new ArgumentNullException(nameof(entityService));
        this.conductSubscriberClient = conductSubscriberClient ?? throw new ArgumentNullException(nameof(conductSubscriberClient));
        this.mqttClientFactory = mqttClientFactory ?? throw new ArgumentNullException(nameof(mqttClientFactory));
        this.configurationService = configurationService ?? throw new ArgumentNullException(nameof(configurationService));
        this.logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    // TODO: Accept channel entity id and retrieve configuration from cloud
    public async Task StartAsync(CancellationToken cancellationToken)
    {
        this.startCancellationToken = cancellationToken;
        var channelsConfiguration =
            await this.configurationService.LoadAsync<Zigbee2MqttWorkerServiceConfiguration>(
                ConfigurationFileName,
                cancellationToken);

        if (channelsConfiguration.Servers.Any())
        {
            this.configuration = channelsConfiguration.Servers.First();
            this.StartMqttClient(this.configuration);
            this.conductSubscriberClient.Subscribe(Zigbee2MqttChannels.DeviceChannel, this.ConductHandler);
        }
    }

    // TODO: Move to channel discovery
    //private async Task DiscoverMqttBrokersAsync(CancellationToken cancellationToken)
    //{
    //    try
    //    {
    //        var applicableHosts = await this.mqttDiscoveryService.DiscoverMqttBrokerHostsAsync("zigbee2mqtt/#", cancellationToken);
    //        foreach (var applicableHost in applicableHosts)
    //        {
    //            try
    //            {
    //                // Save configuration for discovered broker
    //                var config = new Zigbee2MqttWorkerServiceConfiguration.MqttServer
    //                {
    //                    Url = applicableHost.IpAddress
    //                };
    //                this.configuration.Servers.Add(config);
    //                await this.configurationService.SaveAsync(ConfigurationFileName, this.configuration,
    //                    cancellationToken);

    //                // Connect to it
    //                this.StartMqttClient(config);
    //            }
    //            catch (Exception ex)
    //            {
    //                this.logger.LogWarning(
    //                    ex,
    //                    "Failed to configure MQTT broker on {IpAddress}",
    //                    applicableHost.IpAddress);
    //            }
    //        }
    //    }
    //    catch (Exception ex)
    //    {
    //        this.logger.LogWarning(ex, "MQTT broker discovery failed.");
    //    }
    //}

    private async void StartMqttClient(Zigbee2MqttWorkerServiceConfiguration.MqttServer mqttServerConfig)
    {
        try
        {
            this.client = this.mqttClientFactory.Create();
            if (string.IsNullOrWhiteSpace(mqttServerConfig.Url))
            {
                this.logger.LogWarning("MQTT Server has invalid URL: {Url}", mqttServerConfig.Url);
                return;
            }

            var clientName = $"Signalco.Station.Channel.Zigbee2Mqtt.{Guid.NewGuid()}";
            await client.StartAsync(clientName, mqttServerConfig.Url, this.startCancellationToken);
            await client.SubscribeAsync(
                MqttTopicSubscription,
                m => this.MessageHandler(m, this.cts.Token));
            await client.PublishAsync("zigbee2mqtt/bridge/config/devices/get", null);
            await client.PublishAsync("zigbee2mqtt/bridge/config/permit_join", "false");

            this.logger.LogInformation("Started MQTT client {ClientName}", clientName);
        }
        catch (Exception ex)
        {
            this.logger.LogError(ex, "Failed to start MQTT client on URL: {Url}. Retry in {MqttClientStartRetryDelay}ms", mqttServerConfig.Url, MqttClientStartRetryDelay);
            await Task
                .Delay(MqttClientStartRetryDelay, this.startCancellationToken)
                .ContinueWith(_ => this.StartMqttClient(mqttServerConfig), this.startCancellationToken);
        }
    }

    public async Task StopAsync(CancellationToken cancellationToken)
    {
        this.cts.Cancel();
        if (this.client != null)
            await this.client.StopAsync(cancellationToken);
    }

    private async Task ConductHandler(IEnumerable<IConduct> conducts, CancellationToken cancellationToken)
    {
        var conductsTasks = conducts.Select(conduct =>
            this.ExecuteConductAsync(conduct, cancellationToken));
        await Task.WhenAll(conductsTasks);
    }

    private async Task ExecuteConductAsync(IConduct conduct, CancellationToken cancellationToken)
    {
        try
        {
            var entity = await this.entitiesDao.GetAsync(conduct.Pointer.EntityId, cancellationToken);
            if (entity == null)
            {
                this.logger.LogWarning("Conduct entity not found. {@Conduct}", conduct);
                return;
            }

            var contact = entity.Contact(conduct.Pointer.ChannelName, conduct.Pointer.ContactName);
            if (contact == null)
            {
                this.logger.LogWarning("Conduct contact not found on entity. {@Conduct}", conduct);
                return;
            }

            // TODO: Resolve actual value
            var value = conduct.ValueSerialized;
            //if (contact.DataType is "enum" or "double")
            //{
            //    value = conduct.Value.ToString() ?? null;
            //}
            //else if (contact.DataType == "bool")
            //{
            //    value = conduct.Value.ToString()?.ToLowerInvariant() == "true" ? "ON" : "OFF";
            //}

            await this.PublishStateAsync(
                conduct.Pointer.EntityId,
                conduct.Pointer.ContactName,
                value,
                cancellationToken);
        }
        catch (Exception ex)
        {
            this.logger.LogTrace(ex, "Failed to execute conduct {@Conduct}", conduct);
            this.logger.LogWarning("Failed to execute conduct {@Conduct}", conduct);
        }
    }

    private async Task MessageHandler(MqttMessage message, CancellationToken cancellationToken)
    {
        try
        {
            var (_, topic, payload, _) = message;

            // Process logging
            if (topic.StartsWith("zigbee2mqtt/bridge/logging"))
            {
                var log = JsonSerializer.Deserialize<BridgeLogItem>(message.Payload);
                if (log != null) 
                    this.logger.LogDebug("Z2M log: ({Level}) {Message}", log.Level, log.Message);
                return;
            }
                
            if (topic == "zigbee2mqtt/bridge/devices")
                await this.HandleDevicesConfigChangeAsync(message.Payload, cancellationToken);
            else await this.HandleDeviceTopicAsync(topic, payload, cancellationToken);
        }
        catch (Exception ex)
        {
            this.logger.LogTrace(ex, "MessageHandler exception");
            this.logger.LogWarning("Failed to process message: {Topic} {Payload}.", message.Topic, message.Payload);
        }
    }

    private async Task HandleDeviceTopicAsync(string topic, string payload, CancellationToken cancellationToken)
    {
        // Ignore get and set requests for device
        if (topic.Contains("/set/", StringComparison.InvariantCultureIgnoreCase) ||
            topic.Contains("/get/", StringComparison.InvariantCultureIgnoreCase))
            return;

        // Retrieve friendly_name of the device
        var deviceAlias = topic.Split("/", StringSplitOptions.RemoveEmptyEntries)
            .Skip(1).Take(1)
            .FirstOrDefault();
        if (deviceAlias is null or "bridge")
            return;

        var entity = await this.entitiesDao.GetByAliasAsync(deviceAlias, cancellationToken);
        if (entity == null)
        {
            this.logger.LogDebug("Entity {DeviceAlias} not found", deviceAlias);
            return;
        }

        if (topic.Contains($"{deviceAlias}/availability"))
        {
            await this.entityService.ContactSetAsync(new ContactPointer(
                    entity.Id,
                    Zigbee2MqttChannels.DeviceChannel,
                    "offline"),
                (payload == "offline").ToString().ToLowerInvariant(),
                cancellationToken);
            return;
        }

        // Get JSON properties (inside object)
        if (payload.StartsWith("{") && payload.EndsWith("}"))
        {
            var jsonPayload = JToken.Parse(payload);
            var jsonPayloadObject = jsonPayload.Value<JObject>();
            var properties = jsonPayloadObject?.Properties();
            if (properties == null)
                return;

            foreach (var jProperty in properties)
            {
                var contact = entity.Contact(Zigbee2MqttChannels.DeviceChannel, jProperty.Name);
                if (contact == null)
                    continue;

                //var target = this.knownTargets.FirstOrDefault(t =>
                //    t.Identifier == device.Identifier &&
                //    t.Contact == jProperty.Name);
                //if (target == null)
                //{
                //    target = new ContactPointer(device.Id, Zigbee2MqttChannels.DeviceChannel, jProperty.Name);
                //    knownTargets.Add(target);
                //}

                var value = jProperty.Value.Type is JTokenType.Object or JTokenType.Array
                    ? jProperty.Value.ToString(Formatting.None) 
                    : jProperty.Value.Value<string>();

                //var dataType = contact.DataType;
                //var mappedValue = MapZ2MValueToValue(dataType, value);
                //// Ignore empty string values (no data)
                //if (dataType != "string" &&
                //    string.IsNullOrEmpty(value))
                //    return;
                try
                {
                    await this.entityService.ContactSetAsync(contact.Pointer, value, cancellationToken);
                }
                catch (Exception ex)
                {
                    this.logger.LogWarning(ex, "Failed to set entity state {Pointer} to {Value}.", contact.Pointer, value);
                }
            }
        }
    }

    private async Task HandleDevicesConfigChangeAsync(string messagePayload, CancellationToken cancellationToken)
    {
        var config = JsonSerializer.Deserialize<List<BridgeDevice>>(messagePayload, CaseInsensitiveOptions);
        if (config == null) 
            return;

        var deviceDiscoveryTasks = new List<Task>();
        foreach (var bridgeDevice in config)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(bridgeDevice.IeeeAddress))
                {
                    this.logger.LogWarning("Invalid IEEE address {IeeeAddress}. Entity skipped.",
                        bridgeDevice.IeeeAddress);
                    continue;
                }

                deviceDiscoveryTasks.Add(this.EntityDiscoveredAsync(bridgeDevice, cancellationToken));
            }
            catch(Exception ex)
            {
                this.logger.LogTrace(ex, "Entity configuration failed.");
                this.logger.LogWarning("Failed to configure entity {Name} ({Address})", bridgeDevice.FriendlyName, bridgeDevice.IeeeAddress);
            }
        }

        await Task.WhenAll(deviceDiscoveryTasks);
    }
        
    private async Task EntityDiscoveredAsync(BridgeDevice bridgeDevice, CancellationToken cancellationToken)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(bridgeDevice.IeeeAddress))
                throw new ArgumentException("Device IEEE address is required.");

            // TODO: Implement model and vendor contacts
            //if (bridgeDevice.Definition != null)
            //{
            //    deviceConfig.Model = bridgeDevice.Definition.Model;
            //    deviceConfig.Manufacturer = bridgeDevice.Definition.Vendor;
            //}

            // TODO: Add filter by channel (channel entity) - this should be assigned to entity same as identifier
            var entity = (await this.entitiesDao.AllAsync(cancellationToken)).FirstOrDefault(e =>
                e.Contact(Zigbee2MqttChannels.DeviceChannel, "identifier")?.ValueSerialized == bridgeDevice.IeeeAddress);
            if (entity == null)
            {
                var newEntityId = await this.entityService.UpsertAsync(
                    EntityType.Device, 
                    null, 
                    bridgeDevice.FriendlyName ?? bridgeDevice.IeeeAddress ?? "Unknown",
                    cancellationToken);
                entity = await this.entitiesDao.GetAsync(newEntityId, cancellationToken);
                if (!string.IsNullOrWhiteSpace(bridgeDevice.IeeeAddress))
                    await this.entityService.ContactSetAsync(
                        new ContactPointer(newEntityId, Zigbee2MqttChannels.DeviceChannel, "identifier"),
                        bridgeDevice.IeeeAddress, cancellationToken);
            }
            
            // If we failed to create entity log and bail
            if (entity == null)
            {
                this.logger.LogError(
                    "Failed to discover entity contacts because entity with Identifier: {IeeeAddress} is not found.",
                    bridgeDevice.IeeeAddress);
                return;
            }

            if (bridgeDevice.Definition is {Exposes: { }})
            {
                // Check if we need to rename the device
                if (entity.Alias != bridgeDevice.FriendlyName &&
                    !entity.Alias.StartsWith("0x") &&
                    (bridgeDevice.FriendlyName?.StartsWith("0x") ?? true))
                    await this.RenameEntityAsync(bridgeDevice.FriendlyName ?? bridgeDevice.IeeeAddress!, entity.Alias);

                foreach (var feature in bridgeDevice.Definition.Exposes.SelectMany(e =>
                             new List<BridgeDeviceExposeFeature>(e.Features ??
                                                                 Enumerable.Empty<BridgeDeviceExposeFeature>()) {e}))
                {
                    var name = feature.Property;
                    var type = feature.Type;

                    // Must have name and type
                    if (string.IsNullOrWhiteSpace(name) || string.IsNullOrWhiteSpace(type))
                        continue;

                    // Create contact if doesn't exist on entity
                    if (entity.Contact(Zigbee2MqttChannels.DeviceChannel, name) == null)
                    {
                        await this.entityService.ContactSetAsync(
                            new ContactPointer(entity.Id, Zigbee2MqttChannels.DeviceChannel, name),
                            null, cancellationToken);
                    }

                    // Create visit contact
                    var visitContact = entity.Contact(Zigbee2MqttChannels.DeviceChannel, "visit");
                    if (this.configuration != null &&
                        (visitContact == null || (visitContact.ValueSerialized?.Contains(":8080/#/device/") ?? false)))
                    {
                        var url = this.configuration.Url;
                        if (url == "localhost") 
                            url = IpHelper.GetLocalIp();

                        await this.entityService.ContactSetAsync(
                            new ContactPointer(entity.Id, Zigbee2MqttChannels.DeviceChannel, "visit"),
                            $"http://{url}:8080/#/device/{bridgeDevice.IeeeAddress}", 
                            cancellationToken);
                    }

                    //// Map zigbee2mqtt type to signal data type
                    //var dataType = MapZ2MTypeToDataType(type);
                    //if (string.IsNullOrWhiteSpace(dataType))
                    //{
                    //    this.logger.LogWarning(
                    //        "Failed to map input {Input} type {Type} for device {DeviceIdentifier}",
                    //        name, type, deviceConfig.Identifier);
                    //    continue;
                    //}

                    //var access = DeviceContactAccess.None;
                    //if (feature.Access.HasFlag(BridgeDeviceExposeFeatureAccess.Readonly))
                    //    access |= DeviceContactAccess.Read;
                    //if (feature.Access.HasFlag(BridgeDeviceExposeFeatureAccess.Request))
                    //    access |= DeviceContactAccess.Get;
                    //if (feature.Access.HasFlag(BridgeDeviceExposeFeatureAccess.Write))
                    //    access |= DeviceContactAccess.Write;

                    //var dataValues = feature.Values?.ToList();

                    //// Update contact basic information
                    //await this.deviceContactUpdateHandler.HandleAsync(DeviceContactUpdateCommand.FromDevice(
                    //        device,
                    //        Zigbee2MqttChannels.DeviceChannel,
                    //        name,
                    //        c =>
                    //        {
                    //            var existingDataValues = new List<DeviceContactDataValue>(c.DataValues ?? Enumerable.Empty<DeviceContactDataValue>());

                    //            // Reassign old value labels
                    //            var newDataValues = dataValues?.Select(dv =>
                    //                                    new DeviceContactDataValue(dv,
                    //                                        existingDataValues.FirstOrDefault(edv => edv.Value == dv)
                    //                                            ?.Label)) ??
                    //                                existingDataValues;

                    //            return c with { DataType = dataType, Access = access, DataValues = newDataValues};
                    //        }),
                    //    cancellationToken);
                }
            }
        }
        catch (Exception ex)
        {
            this.logger.LogWarning("Discovery failed for unknown reason for entity identifier: {EntityIdentifier}.", bridgeDevice.IeeeAddress);
            this.logger.LogTrace(ex, "Discovery failed: {EntityIdentifier}", bridgeDevice.IeeeAddress);
        }
    }

    private async Task RenameEntityAsync(string oldAlias, string alias)
    {
        try
        {
            this.logger.LogInformation("Renaming {OldAlias} > {NewAlias}", oldAlias, alias);

            const string topic = "zigbee2mqtt/bridge/request/device/rename";
            if (this.client != null)
                await this.client.PublishAsync(topic, JsonConvert.SerializeObject(new
                {
                    from = oldAlias,
                    to = alias
                }));
        }
        catch (Exception ex)
        {
            this.logger.LogWarning(ex, "Failed to rename device.");
        }
    }

    private async Task PublishStateAsync(string entityId, string contactName, string? value, CancellationToken cancellationToken)
    {
        try
        {
            var entity = await this.entitiesDao.GetAsync(entityId, cancellationToken);
            if (entity == null)
                throw new Exception($"Device with identifier {entityId} not found.");

            // TODO: Publish only to specific client (that has device)

            var identifierContact = entity.Contact(Zigbee2MqttChannels.DeviceChannel, "identifier");
            if (identifierContact == null || string.IsNullOrWhiteSpace(identifierContact.ValueSerialized))
                throw new Exception($"Identifier not present on entity {entityId}");

            var topic = $"zigbee2mqtt/{identifierContact.ValueSerialized}/set/{contactName}";
            if (this.client != null)
                await this.client.PublishAsync(topic, value);
        }
        catch (Exception ex)
        {
            this.logger.LogError(ex, "Failed to publish message.");
        }
    }
}