using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Sockets;
using System.Threading;
using System.Threading.Tasks;
using HueApi;
using HueApi.BridgeLocator;
using HueApi.Models;
using HueApi.Models.Exceptions;
using HueApi.Models.Requests;
using HueApi.Models.Responses;
using Microsoft.Extensions.Logging;
using Signal.Beacon.Core.Conducts;
using Signal.Beacon.Core.Configuration;
using Signal.Beacon.Core.Entity;
using Signal.Beacon.Core.Extensions;
using Signal.Beacon.Core.Workers;

namespace Signal.Beacon.Channel.PhilipsHue;

internal class PhilipsHueWorkerService(
    IEntitiesDao entitiesDao,
    IEntityService entityService,
    IConductSubscriberClient conductSubscriberClient,
    ILogger<PhilipsHueWorkerService> logger,
    IChannelConfigurationService configurationService)
    : IWorkerService
{
    private const int RegisterBridgeRetryTimes = 12;
    private const string LightStateContactName = "on";
    private const string BrightnessContactName = "brightness";
    private const string ColorTemperatureContactName = "color-temperature";

    private PhilipsHueWorkerServiceConfiguration configuration = new();
    private readonly List<BridgeConnection> bridges = [];
    private readonly Dictionary<Guid, PhilipsHueLight> lights = new();
    private readonly List<LocalHueApi> clipClients = [];
    private string? channelEntityId;

    public async Task StartAsync(string entityId, CancellationToken cancellationToken)
    {
        this.channelEntityId = entityId;
        this.configuration = await this.LoadBridgeConfigsAsync(cancellationToken);

        // Remove duplicate bridge configuration (same IP address)
        var ipAddresses = new List<string>();
        for (var i = this.configuration.Bridges.Count - 1; i >= 0; i--)
        {
            var currentIpAddress = this.configuration.Bridges[i].IpAddress;
            if (ipAddresses.Contains(currentIpAddress))
            {
                this.configuration.Bridges.RemoveAt(i);
                logger.LogInformation("Removed bridge because IP address {IpAddress} already assigned", currentIpAddress);
            }
            else ipAddresses.Add(currentIpAddress);
        }

        // Connect to already configured bridges
        foreach (var bridgeConfig in this.configuration.Bridges.ToList())
            _ = this.ConnectBridgeAsync(bridgeConfig, cancellationToken);

        conductSubscriberClient.Subscribe(PhilipsHueChannels.DeviceChannel, this.ConductHandlerAsync);
    }

    private void BeginStreamClip(BridgeConfig config, CancellationToken cancellationToken)
    {
        var clipClient = new LocalHueApi(config.IpAddress, config.LocalAppKey);
        clipClient.StartEventStream(cancellationToken: cancellationToken);
        clipClient.OnEventStreamMessage += (_, events) => this.HandleClipMessage(config.Id, events, cancellationToken);
        this.clipClients.Add(clipClient);
    }

    private async void HandleClipMessage(string bridgeId, IEnumerable<EventStreamResponse> events,
        CancellationToken cancellationToken)
    {
        foreach (var data in events.SelectMany(hueEvent =>
                     hueEvent.Data.Where(data => !string.IsNullOrWhiteSpace(data.IdV1))))
        {
            var bridge = this.GetBridgeConnection(bridgeId);
            var matchedLight = this.lights.Values.FirstOrDefault(l =>
                l.BridgeId == bridgeId &&
                l.Id == data.Id);
            if (matchedLight != null)
                await this.RefreshLightStateAsync(bridge, matchedLight, cancellationToken);
        }
    }

    private async Task ConductHandlerAsync(IEnumerable<IConduct> conducts, CancellationToken cancellationToken)
    {
        var conductsList = conducts.ToList();

        // Handle discover request
        if (conductsList.Any(c => c.Pointer is {ChannelName: PhilipsHueChannels.DeviceChannel, ContactName: "discover"}))
            _ = this.DiscoverBridgesAsync(true, cancellationToken);

        // Handle light conducts
        var conductsTasks = conductsList
            .GroupBy(c => this.lights.First(l =>
                l.Value.EntityId == c.Pointer.EntityId).Value)
            .Select(lightIdentifierConducts =>
                this.ExecuteLightConductsAsync(lightIdentifierConducts, cancellationToken));
        await Task.WhenAll(conductsTasks);
    }

    private async Task ExecuteLightConductsAsync(
        IGrouping<PhilipsHueLight, IConduct>? lightConducts,
        CancellationToken cancellationToken)
    {
        if (lightConducts == null) return;

        try
        {
            var light = lightConducts.Key;

            // Retrieve bridge connection
            var bridgeConnection = this.GetBridgeConnection(light.BridgeId);
            var bridgeLightResponse = await bridgeConnection.LocalClient.GetLightAsync(light.Id);
            var bridgeLight = bridgeLightResponse.Data.FirstOrDefault();
            if (bridgeLightResponse.HasErrors ||
                bridgeLight == null)
            {
                // TODO: Log response errors
                logger.LogWarning(
                    "No light with specified identifier found on bridge. Target identifier: {TargetIdentifier}.",
                    light.Id);
                return;
            }

            // Construct light command from conducts
            var lightCommand = new UpdateLight();
            foreach (var conduct in lightConducts)
            {
                try
                {
                    switch (conduct.Pointer.ContactName)
                    {
                        case LightStateContactName:
                            lightCommand.On = new On
                            {
                                IsOn = conduct.ValueSerialized?.ToLowerInvariant() == "true"
                            };
                            break;
                        case ColorTemperatureContactName:
                            if (!double.TryParse(conduct.ValueSerialized, out var temp))
                                throw new Exception("Invalid temperature contact value.");

                            if (bridgeLight.ColorTemperature == null)
                            {
                                logger.LogWarning("Light doesn't support color temperature.");
                                break;
                            }

                            lightCommand.ColorTemperature = new ColorTemperature
                            {
                                Mirek = temp.NormalizedToMirek(
                                    bridgeLight.ColorTemperature.MirekSchema.MirekMinimum,
                                    bridgeLight.ColorTemperature.MirekSchema.MirekMaximum)
                            };

                            break;
                        case BrightnessContactName:
                            if (!double.TryParse(conduct.ValueSerialized, out var brightness))
                                throw new Exception("Invalid brightness contact value.");

                            lightCommand.Dimming = new Dimming
                            {
                                Brightness = (byte)brightness.Denormalize(0, 255)
                            };
                            break;
                        default:
                            throw new NotSupportedException("Not supported contact.");
                    }
                }
                catch (Exception ex)
                {
                    logger.LogTrace(ex, "Couldn't handle conduct {@Conduct}", conduct);
                    logger.LogWarning("Conduct error message: {Message} for conduct: {@Conduct}", ex.Message, conduct);
                }
            }

            // Send the constructed command to the bridge
            logger.LogDebug(
                "Sending command to the bridge {BridgeId}: {@Command}",
                light.BridgeId, lightCommand);
            await bridgeConnection.LocalClient.UpdateLightAsync(light.Id, lightCommand);

            // Refresh immediately 
            await this.RefreshLightStateAsync(bridgeConnection, light, cancellationToken);
        }
        catch (Exception ex)
        {
            logger.LogTrace(ex, "Failed to execute conduct {@Conducts}", lightConducts);
            logger.LogWarning("Failed to execute conduct {@Conducts}", lightConducts);
        }
    }

    private async Task RefreshDeviceStatesAsync(string bridgeId, CancellationToken cancellationToken)
    {
        var bridge = this.GetBridgeConnection(bridgeId);
        foreach (var (_, light) in this.lights)
            await this.RefreshLightStateAsync(bridge, light, cancellationToken);
    }

    private BridgeConnection GetBridgeConnection(string id) =>
        this.bridges.FirstOrDefault(b => b.Config.Id == id)
            ?? throw new Exception("Bridge not unknown or not initialized yet.");

    private async Task RefreshLightStateAsync(
        BridgeConnection bridge, 
        PhilipsHueLight light,
        CancellationToken cancellationToken)
    {
        var updatedLightResponse = await bridge.LocalClient.GetLightAsync(light.Id);
        var updatedLight = updatedLightResponse.Data.FirstOrDefault();
        if (!updatedLightResponse.HasErrors &&
            updatedLight != null)
        {
            var newLight = updatedLight.AsPhilipsHueLight(bridge.Config.Id, light.EntityId);
            this.lights[light.Id] = newLight;

            // Sync state
            await entityService.ContactSetAsync(
                new ContactPointer(newLight.EntityId, PhilipsHueChannels.DeviceChannel, LightStateContactName),
                updatedLight.On.IsOn.ToString().ToLowerInvariant(), cancellationToken);
            await entityService.ContactSetAsync(
                new ContactPointer(newLight.EntityId, PhilipsHueChannels.DeviceChannel, ColorTemperatureContactName),
                newLight.State.Temperature?.ToString(), cancellationToken);
            await entityService.ContactSetAsync(
                new ContactPointer(newLight.EntityId, PhilipsHueChannels.DeviceChannel, BrightnessContactName),
                newLight.State.Brightness?.ToString(), cancellationToken);
            var connectivity = await bridge.LocalClient.GetZigbeeConnectivityAsync();
            var isConnected = connectivity.Data.FirstOrDefault(c => updatedLight.Owner?.Rid == c.Owner?.Rid)?.Status == ConnectivityStatus.connected;
            await entityService.ContactSetAsync(
                new ContactPointer(newLight.EntityId, PhilipsHueChannels.DeviceChannel, KnownContacts.Offline),
                (!isConnected).ToString().ToLowerInvariant(), cancellationToken);
        }
        else
        {
            // TODO: Log errors from response
            logger.LogWarning(
                "Light with ID {LightId} not found on bridge {BridgeName}.",
                light.Id,
                bridge.Config.Id);
        }
    }

    private async Task<PhilipsHueWorkerServiceConfiguration> LoadBridgeConfigsAsync(CancellationToken cancellationToken) => 
        await configurationService.LoadAsync<PhilipsHueWorkerServiceConfiguration>(this.channelEntityId, PhilipsHueChannels.DeviceChannel, cancellationToken);

    private async Task SaveBridgeConfigsAsync(CancellationToken cancellationToken) => 
        await configurationService.SaveAsync(this.channelEntityId, PhilipsHueChannels.DeviceChannel, this.configuration, cancellationToken);

    private async Task ConnectBridgeAsync(BridgeConfig config, CancellationToken cancellationToken)
    {
        try
        {
            logger.LogInformation("Connecting to bridge {BridgeId} {BridgeIpAddress}...",
                config.Id,
                config.IpAddress);

            var client = new LocalHueApi(config.IpAddress, config.LocalAppKey);

            var existingBridge = this.bridges.FirstOrDefault(b => b.Config.Id == config.Id);
            if (existingBridge != null)
                existingBridge.AssignNewClient(client);
            else this.bridges.Add(new BridgeConnection(config, client));

            await this.SyncDevicesWithBridge(config.Id, cancellationToken);
            await this.RefreshDeviceStatesAsync(config.Id, cancellationToken);
            this.BeginStreamClip(config, cancellationToken);
        }
        catch (Exception ex) when (ex is SocketException {SocketErrorCode: SocketError.TimedOut} ||
                                   ex is HttpRequestException && ex.InnerException is SocketException
                                   {
                                       SocketErrorCode: SocketError.TimedOut
                                   })
        {
            logger.LogWarning(
                "Bridge {BridgeIp} ({BridgeId}) didn't respond in time. Trying to rediscover on another IP address...",
                config.IpAddress, config.Id);
            _ = this.DiscoverBridgesAsync(false, cancellationToken);
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "Failed to connect to bridge.");
        }
    }

    private async Task SyncDevicesWithBridge(string bridgeId, CancellationToken cancellationToken)
    {
        try
        {
            var bridge = this.GetBridgeConnection(bridgeId);
            var remoteLightsResponse = await bridge.LocalClient.GetLightsAsync();
            var remoteLights = remoteLightsResponse.Data;
            foreach (var light in remoteLights)
            {
                try
                {
                    await this.LightDiscoveredAsync(bridgeId, light, cancellationToken);
                }
                catch (Exception ex)
                {
                    logger.LogTrace(ex, "Failed to configure device {Address}", light.Id);
                    logger.LogWarning(
                        "Failed to configure device {Address}", 
                        light.Id);
                }
            }
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "Failed to sync devices.");
        }
    }
        

    private async Task LightDiscoveredAsync(string bridgeId, Light light, CancellationToken cancellationToken)
    {
        // Discover light entity
        var entityId = (await entitiesDao.GetByContactValueAsync(
            PhilipsHueChannels.DeviceChannel,
            "identifier",
            light.Id.ToString(),
            cancellationToken)).FirstOrDefault()?.Id;
        if (entityId == null)
        {
            entityId = await entityService.UpsertAsync(EntityType.Device, null, light.Metadata?.Name ?? "Light", cancellationToken);
            await entityService.ContactSetAsync(
                new ContactPointer(entityId, PhilipsHueChannels.DeviceChannel, "identifier"), light.Id.ToString(), cancellationToken);
        }
        
        this.lights.Add(light.Id, light.AsPhilipsHueLight(bridgeId, entityId));
    }

    private async Task DiscoverBridgesAsync(bool acceptNewBridges, CancellationToken cancellationToken)
    {
        logger.LogInformation("Scanning for bridge...");

        var discoveredBridges = (await new MdnsBridgeLocator()
                .LocateBridgesAsync(TimeSpan.FromSeconds(30)))
            .ToList();
        logger.LogInformation("Bridges found: {BridgesCount}", discoveredBridges.Count);

        if (discoveredBridges.Count <= 0)
        {
            logger.LogInformation("No bridges found.");
            return;
        }

        var retryCounter = 0;
        var bridge = discoveredBridges.First();
        while (retryCounter < RegisterBridgeRetryTimes &&
               !cancellationToken.IsCancellationRequested)
        {
            try
            {
                var existingConnection = this.bridges.FirstOrDefault(b => b.Config.Id == bridge.BridgeId);
                if (existingConnection != null)
                {
                    existingConnection.Config.IpAddress = bridge.IpAddress;
                    logger.LogInformation(
                        "Bridge rediscovered {BridgeIp} ({BridgeId}).",
                        existingConnection.Config.IpAddress, existingConnection.Config.Id);

                    // Persist updated configuration
                    this.configuration.Bridges.First(b => b.Id == existingConnection.Config.Id).IpAddress =
                        bridge.IpAddress;
                    await this.SaveBridgeConfigsAsync(cancellationToken);

                    _ = this.ConnectBridgeAsync(existingConnection.Config, cancellationToken);
                }
                else if (acceptNewBridges)
                {
                    var registerResult =
                        await LocalHueApi.RegisterAsync(bridge.IpAddress, "Signal.Beacon.Hue", "HueStation");
                    if (registerResult == null ||
                        string.IsNullOrWhiteSpace(registerResult.Username))
                        throw new Exception("Hub responded with null key.");

                    var bridgeConfig = new BridgeConfig(bridge.BridgeId, bridge.IpAddress, registerResult.Username);

                    // Persist bridge configuration
                    this.configuration.Bridges.Add(bridgeConfig);
                    await this.SaveBridgeConfigsAsync(cancellationToken);

                    _ = this.ConnectBridgeAsync(bridgeConfig, cancellationToken);
                }

                break;
            }
            catch (LinkButtonNotPressedException ex)
            {
                logger.LogTrace(ex, "Bridge not connected. Waiting for user button press.");
                logger.LogInformation("Press button on Philips Hue bridge to connect...");
                // TODO: Broadcast CTA on UI (ask user to press button on bridge)
                retryCounter++;

                // Give user some time to press the button
                await Task.Delay(5000, cancellationToken);
            }
        }
    }
        
    public Task StopAsync()
    {
        this.clipClients.ForEach(cc => cc.StopEventStream());
        return Task.CompletedTask;
    }
}