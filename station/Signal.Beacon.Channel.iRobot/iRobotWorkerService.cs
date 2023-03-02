using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Security;
using System.Net.Sockets;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Signal.Beacon.Core.Conducts;
using Signal.Beacon.Core.Configuration;
using Signal.Beacon.Core.Entity;
using Signal.Beacon.Core.Mqtt;
using Signal.Beacon.Core.Network;
using Signal.Beacon.Core.Workers;
using JsonSerializer = System.Text.Json.JsonSerializer;

namespace Signal.Beacon.Channel.iRobot;

// ReSharper disable once InconsistentNaming
internal class iRobotWorkerService : IWorkerService
{
    private const string ConfigurationFileName = "iRobot.json";

    private readonly string[] allowedMacCompanies =
    {
        "iRobot Corporation"
    };

    private readonly IEntityService entityService;
    private readonly IEntitiesDao entitiesDao;
    private readonly IConfigurationService configurationService;
    private readonly IHostInfoService hostInfoService;
    private readonly IMacLookupService macLookupService;
    private readonly ILogger<iRobotWorkerService> logger;
    private readonly IMqttClientFactory mqttClientFactory;
    private readonly IConductSubscriberClient conductSubscriberClient;
    private CancellationToken startCancellationToken;
    private iRobotWorkerServiceConfiguration? configuration;
    private readonly Dictionary<string, IMqttClient> roombaClients = new();

    public iRobotWorkerService(
        IEntityService entityService,
        IEntitiesDao entitiesDao,
        IConfigurationService configurationService,
        IHostInfoService hostInfoService,
        IMacLookupService macLookupService,
        IMqttClientFactory mqttClientFactory,
        IConductSubscriberClient conductSubscriberClient,
        ILogger<iRobotWorkerService> logger)
    {
        this.entityService = entityService ?? throw new ArgumentNullException(nameof(entityService));
        this.entitiesDao = entitiesDao ?? throw new ArgumentNullException(nameof(entitiesDao));
        this.configurationService = configurationService ?? throw new ArgumentNullException(nameof(configurationService));
        this.hostInfoService = hostInfoService ?? throw new ArgumentNullException(nameof(hostInfoService));
        this.macLookupService = macLookupService ?? throw new ArgumentNullException(nameof(macLookupService));
        this.logger = logger ?? throw new ArgumentNullException(nameof(logger));
        this.mqttClientFactory = mqttClientFactory ?? throw new ArgumentNullException(nameof(mqttClientFactory));
        this.conductSubscriberClient = conductSubscriberClient ?? throw new ArgumentNullException(nameof(conductSubscriberClient));
    }


    public async Task StartAsync(CancellationToken cancellationToken)
    {
        this.startCancellationToken = cancellationToken;
        this.configuration =
            await this.configurationService.LoadAsync<iRobotWorkerServiceConfiguration>(
                ConfigurationFileName,
                cancellationToken);

        this.conductSubscriberClient.Subscribe(iRobotChannels.RoombaChannel, this.ConductHandler);

        //if (!this.configuration.RoombaRobots.Any())
        //    _ = this.DiscoverDevicesAsync();
        //else 
        this.configuration.RoombaRobots.ForEach((c) => _ = this.ConnectToRoomba(c));
    }

    private async Task ConductHandler(IEnumerable<IConduct> conducts, CancellationToken cancellationToken)
    {
        foreach (var conduct in conducts)
        {
            try
            {
                var entity = await this.entitiesDao.GetAsync(conduct.Pointer.EntityId, cancellationToken);
                if (entity == null)
                    throw new Exception($"Unknown entity {conduct.Pointer.EntityId}");
                var identifier = entity.Contact(iRobotChannels.RoombaChannel, "identifier")?.ValueSerialized;
                if (string.IsNullOrWhiteSpace(identifier))
                    throw new Exception($"Setup not completed for robot {entity.Id}");

                switch (conduct.Pointer.ContactName)
                {
                    case "cleanArea":
                        var areas = JsonSerializer.Deserialize<IEnumerable<string>>(
                                        conduct.ValueSerialized ??
                                        throw new InvalidOperationException("Expected array of data values.")) ??
                                    throw new Exception("Failed to deserialize areas.");

                        var mapId = "";
                        var userMapId = "";
                        var regions = new List<(string regionId, string type)>();
                        foreach (var area in areas)
                        {
                            var valueSplit = area.Split("-");
                            if (valueSplit.Length < 4)
                                throw new Exception(
                                    "Invalid conduct value. Expected mapId, userMapId, type and regionId separated by '-'.");

                            mapId = valueSplit[0];
                            userMapId = valueSplit[1];
                            regions.Add((valueSplit[3], valueSplit[2]));
                        }

                        await this.SendRoombaCleanAreaAsync(identifier, mapId, userMapId, regions);
                        break;
                    case "dock":
                        await this.SendRoombaCommandAsync(identifier, "dock");
                        break;
                    case "pause":
                        await this.SendRoombaCommandAsync(identifier, "pause");
                        break;
                    default:
                        throw new NotSupportedException("Invalid conduct contact.");
                }
            }
            catch (Exception ex)
            {
                this.logger.LogTrace(ex, "Failed to execute conduct {@Conduct}", conduct);
                this.logger.LogWarning("Failed to execute conduct {@Conduct}", conduct);
            }
        }
    }

    private async Task ConnectToRoomba(iRobotWorkerServiceConfiguration.RoombaConfiguration config)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(config.RobotId))
            {
                this.logger.LogWarning("Can't connect to Roomba with unknown RobotIdentifier. Finish connection first.");
                // TODO: Begin targeted discovery
                return;
            }

            var client = this.mqttClientFactory.Create();
            client.OnMessage += this.RoombaOnAnyMessage;
            client.OnUnavailable += (_, _) => this.RoombaUnavailable(config);
            this.roombaClients.Add(config.RobotId, client);

            // Start communication
            await client.StartAsync(
                config.RobotId,
                config.IpAddress, 
                this.startCancellationToken, 
                8883,
                config.RobotId, 
                config.RobotPassword, 
                true);
                
            // Discover push to Signal
            var entity = (await this.entitiesDao.GetByContactValueAsync(
                iRobotChannels.RoombaChannel,
                "identifier",
                config.RobotId, 
                this.startCancellationToken)).FirstOrDefault();
            if (entity == null)
            {
                var newEntityId = await this.entityService.UpsertAsync(
                    EntityType.Device,
                    null,
                    "iRobot Robot",
                    this.startCancellationToken);
                await this.entityService.ContactSetAsync(
                    new ContactPointer(
                        newEntityId,
                        iRobotChannels.RoombaChannel,
                        "identifier"),
                    config.RobotId, 
                    this.startCancellationToken);
                entity = await this.entitiesDao.GetAsync(newEntityId, this.startCancellationToken);
                if (entity == null)
                    throw new Exception($"Entity doesn't exist {newEntityId}");
            }

            // Update contacts
            var pointer = new ContactPointer(entity.Id, iRobotChannels.RoombaChannel, string.Empty);
            await this.entityService.ContactSetAsync(pointer with {ContactName = "cycle"}, null, this.startCancellationToken);
            await this.entityService.ContactSetAsync(pointer with { ContactName = "phase" }, null, this.startCancellationToken);
            await this.entityService.ContactSetAsync(pointer with { ContactName = "battery" }, null, this.startCancellationToken);
            await this.entityService.ContactSetAsync(pointer with { ContactName = "cleanAll" }, null, this.startCancellationToken);
            await this.entityService.ContactSetAsync(pointer with { ContactName = "cleanArea" }, null, this.startCancellationToken);
            await this.entityService.ContactSetAsync(pointer with { ContactName = "pause" }, null, this.startCancellationToken);
            await this.entityService.ContactSetAsync(pointer with { ContactName = "dock" }, null, this.startCancellationToken);
        }
        catch (Exception ex)
        {
            this.logger.LogDebug(ex, "Roomba connection start failed");
            this.logger.LogWarning("Failed to connect to Roomba.");
        }
    }

    private async void RoombaUnavailable(iRobotWorkerServiceConfiguration.RoombaConfiguration config)
    {
        await this.DisconnectRoombaClientAsync(config.RobotId);

        // Find new potential devices and match to existing physical address
        var potentialDevices = await this.GetPotentialRoombaDevicesAsync(this.startCancellationToken);
        var matchedDevice = potentialDevices
            .Select(pd => pd.physicalAddress)
            .FirstOrDefault(pa => pa == config.PhysicalAddress);

        // Handle device not matched on network
        if (matchedDevice == null)
        {
            this.logger.LogWarning("Didn't find Roomba device {RobotId} on network. Will retry again soon...", config.RobotId);
            await Task.Delay(TimeSpan.FromMinutes(1), this.startCancellationToken);
            _ = this.ConnectToRoomba(config);
            return;
        }

        // Assign new IP address
        config.IpAddress = potentialDevices.First(d => d.physicalAddress == config.PhysicalAddress).ipAddress;

        // Save updated configuration
        await this.configurationService.SaveAsync(
            ConfigurationFileName,
            this.configuration,
            this.startCancellationToken);

        // Connect to robot
        _ = this.ConnectToRoomba(config);
    }

    private async Task DisconnectRoombaClientAsync(string robotId)
    {
        if (!this.roombaClients.TryGetValue(robotId, out var client))
            return;

        // Dispose client
        try
        {
            await client.StopAsync(this.startCancellationToken);
            client.Dispose();
        }
        catch (Exception ex)
        {
            this.logger.LogWarning(ex, "Failed to stop and dispose MQTT client.");
        }

        // Remove client
        this.roombaClients.Remove(robotId);
    }

    private async void RoombaOnAnyMessage(object? _, MqttMessage message)
    {
        if (!message.Topic.Contains("/shadow/update")) return;

        var robotId = message.Topic[12..44];
        var status = JsonSerializer.Deserialize<RoombaMqttStatusDto>(message.Payload);
        if (status?.State?.Reported == null) return;

        // Update battery percentage
        if (status.State.Reported.BatteryPercentage != null)
            await this.PushRoombaStateAsync(robotId, "battery", status.State.Reported.BatteryPercentage);

        if (status.State.Reported.CleanMissionStatus != null)
            await this.UpdateRoombaMissionAsync(robotId, status.State.Reported.CleanMissionStatus);

        if (status.State.Reported.Pose != null)
            this.UpdateRoombaPose(robotId, status.State.Reported.Pose);

        // Assign DataValues to Area contacts
        // TODO: Reimplement when value data is available
        //var newRegionDataValues = status.State.Reported.LastCommand?.Regions?
        //    .Where(r => !string.IsNullOrWhiteSpace(r.RegionId) && !string.IsNullOrWhiteSpace(r.Type))
        //    .Select(r => (r.RegionId, r.Type))
        //    .Select(newRoomId =>
        //        new DeviceContactDataValue(
        //            $"{status.State.Reported.LastCommand.MapId}-{status.State.Reported.LastCommand.UserMapId}-{newRoomId.Type}-{newRoomId.RegionId}",
        //            $"{(newRoomId.Type == "zid" ? "Zone" : "Room")} {newRoomId}"))
        //    .ToList() ?? new List<DeviceContactDataValue>();

        //// We need map identifier and any region in command
        //if (status.State.Reported.LastCommand != null && newRegionDataValues.Any())
        //{
        //    var device = await this.devicesDao.GetAsync(robotId, this.startCancellationToken);
        //    if (device != null)
        //    {
        //        await this.deviceContactUpdateHandler.HandleAsync(
        //            DeviceContactUpdateCommand.FromDevice(
        //                device,
        //                iRobotChannels.RoombaChannel,
        //                "cleanArea",
        //                c => c with {DataValues = c.MergeDataValues(newRegionDataValues, i => i.Value, i => i.Label)}), 
        //            this.startCancellationToken);
        //    }
        //}
    }

    private async Task UpdateRoombaMissionAsync(string robotId, RoombaMqttStatusDto.StateDto.ReportedDto.CleanMissionStatusDto mission)
    {
        await this.PushRoombaStateAsync(robotId, "cycle", mission.Cycle);
        await this.PushRoombaStateAsync(robotId, "phase", mission.Phase);
    }

    private async Task PushRoombaStateAsync(string robotIdentifier, string contact, object? value)
    {
        var entity = (await this.entitiesDao.GetByContactValueAsync(
            iRobotChannels.RoombaChannel,
            "identifier",
            robotIdentifier,
            this.startCancellationToken)).FirstOrDefault();
        if (entity == null)
            throw new Exception($"Unknown robot with identifier {robotIdentifier}");

        await this.entityService.ContactSetAsync(
            new ContactPointer(
                entity.Id,
                iRobotChannels.RoombaChannel,
                contact),
            value?.ToString(),
            this.startCancellationToken);
    }

    private void UpdateRoombaPose(string robotId, RoombaMqttStatusDto.StateDto.ReportedDto.PoseDto pose)
    {
        // TODO: Persist pose
        this.logger.LogTrace($"Robot {robotId} pose (not persisted): {pose}");
    }

    private async Task SendRoombaCommandAsync(string robotId, string command)
    {
        var client = this.roombaClients[robotId];

        var data = new
        {
            command,
            time = (DateTime.UtcNow.Ticks - 621355968000000000) / 10000 / 1000 | 0,
            initiator = "localApp"
        };

        await client.PublishAsync("cmd", data);
    }

    private async Task SendRoombaCleanAreaAsync(string robotId, string mapId, string userMapId, IEnumerable<(string regionId, string type)> regions)
    {
        var client = this.roombaClients[robotId];

        var data = new
        {
            command = "start",
            initiator = "localApp",
            time = (DateTime.UtcNow.Ticks - 621355968000000000) / 10000 / 1000 | 0,
            pmap_id = mapId,
            regions = regions.Select(r => new { region_id = r.regionId, r.type }),
            user_pmapv_id = userMapId,
            ordered = 1
        };

        await client.PublishAsync("cmd", data);
    }

    private async Task AuthenticateRoombaAsync(string ipAddress, string physicalAddress, string robotId)
    {
        try
        {
            var client = new TcpClient();
            await client.ConnectAsync(ipAddress, 8883, this.startCancellationToken);
            var stream = new SslStream(client.GetStream());
            await stream.AuthenticateAsClientAsync(new SslClientAuthenticationOptions
            {
                RemoteCertificateValidationCallback = (_, _, _, _) => true,
                TargetHost = ipAddress
            }, this.startCancellationToken);

            // Listen forever or timeout
            var startDateTime = DateTime.UtcNow;
            while (!this.startCancellationToken.IsCancellationRequested)
            {
                // Send magic payload
                stream.Write(new byte[] { 0xf0, 0x05, 0xef, 0xcc, 0x3b, 0x29, 0x00 });

                var buffer = new byte[256];
                var responseLength = 0;
                do
                {
                    // Break due to timeout
                    if (DateTime.UtcNow - startDateTime > TimeSpan.FromMinutes(1))
                        break;

                    try
                    {
                        responseLength = await stream.ReadAsync(buffer, this.startCancellationToken);
                    }
                    catch (Exception ex)
                    {
                        this.logger.LogWarning(ex, "Reading Roomba authenticate response failed.");
                        break;
                    }

                    if (responseLength <= 0) 
                        Thread.Sleep(100);
                } while (responseLength <= 0);

                // No response after a timeout
                if (responseLength <= 0)
                {
                    this.logger.LogDebug("Failed to authenticate Roomba - no response.");
                    break;
                }

                this.logger.LogTrace("Received robot password response: {Password}",
                    string.Join(" ", buffer.Take(responseLength).Select(b => $"{b:X2}")));

                // Handle password response
                if (responseLength > 7 && buffer[0] == 0xF0 && buffer[6] == 0x00)
                {
                    // Process response
                    var passwordStringUtf8 = Encoding.UTF8.GetString(buffer[07..(responseLength-1)]);
                    this.logger.LogTrace("Received robot password: {Password}", passwordStringUtf8);

                    var config = new iRobotWorkerServiceConfiguration.RoombaConfiguration(
                        ipAddress,
                        physicalAddress,
                        robotId,
                        passwordStringUtf8);

                    // TODO: Save configuration after connected successfully
                    this.configuration?.RoombaRobots.Add(config);
                    await this.configurationService.SaveAsync(
                        ConfigurationFileName, 
                        this.configuration,
                        this.startCancellationToken);

                    await this.ConnectToRoomba(config);

                    return;
                }

                this.logger.LogInformation("To connect to Roomba, please press HOME button on robot until ring light turns blue...");
                Thread.Sleep(2000);
            }

            this.logger.LogWarning("Didn't finish Roomba setup - timeout. Try again.");
        }
        catch (Exception ex)
        {
            this.logger.LogDebug(ex, "Failed to authenticate Roomba.");
            this.logger.LogWarning("Failed to authenticate Roomba.");
        }
    }

    private async Task<List<(string ipAddress, string physicalAddress)>> GetPotentialRoombaDevicesAsync(
        CancellationToken cancellationToken)
    {
        var ipAddressesInRange = IpHelper.GetIPAddressesInRange(IpHelper.GetLocalIp());
        var matchedHosts = await this.hostInfoService.HostsAsync(ipAddressesInRange, new[] { 8883 }, cancellationToken);
        var potentialDevices = new List<(string ipAddress, string physicalAddress)>();
        foreach (var hostInfo in matchedHosts)
        {
            // Ignore if no open ports
            if (!hostInfo.OpenPorts.Any()) continue;

            if (string.IsNullOrWhiteSpace(hostInfo.PhysicalAddress))
            {
                this.logger.LogDebug("Device MAC not found. Ip: {IpAddress}", hostInfo.IpAddress);
                continue;
            }

            // Validate MAC vendor
            var deviceCompany = await this.macLookupService.CompanyNameLookupAsync(hostInfo.PhysicalAddress, cancellationToken);
            if (!this.allowedMacCompanies.Contains(deviceCompany))
            {
                this.logger.LogDebug(
                    "Device MAC not whitelisted. Ip: {IpAddress} Mac: {PhysicalAddress} Company: {MacCompany}",
                    hostInfo.PhysicalAddress, hostInfo.IpAddress, deviceCompany ?? "Not found");
                continue;
            }

            // TODO: Add to possible matches (instead of directly connecting)
            this.logger.LogDebug(
                "Potential iRobot device found on address \"{DeviceIp}\" (\"{PhysicalAddress}\")",
                hostInfo.IpAddress, hostInfo.PhysicalAddress);

            potentialDevices.Add((hostInfo.IpAddress, hostInfo.PhysicalAddress));
        }
        return potentialDevices;
    }

    private async Task DiscoverDevicesAsync()
    {
        // Try to connect to all potential devices
        foreach (var potentialDevice in await this.GetPotentialRoombaDevicesAsync(this.startCancellationToken))
            await this.DiscoverDeviceAsync(potentialDevice.ipAddress, potentialDevice.physicalAddress);
    }

    private async Task DiscoverDeviceAsync(string ipAddress, string physicalAddress)
    {
        try
        {
            var client = new UdpClient();
            var requestData = Encoding.ASCII.GetBytes("irobotmcs");
            client.EnableBroadcast = true;
            await client.SendAsync(requestData, requestData.Length, new IPEndPoint(IPAddress.Parse(ipAddress), 5678));

            while (!this.startCancellationToken.IsCancellationRequested)
            {
                var serverResponseData = await client.ReceiveAsync();
                var serverResponse = Encoding.ASCII.GetString(serverResponseData.Buffer);
                this.logger.LogTrace("Received {Data} from {Source}", serverResponse, serverResponseData.RemoteEndPoint);

                var response = JsonSerializer.Deserialize<iRobotMcsResponse>(serverResponse);
                if (response == null ||
                    string.IsNullOrWhiteSpace(response.RobotId))
                    throw new Exception("MCS returned response without robot identifier.");

                // TODO: Discover robot ID and check if supported by this service (roomba for now)

                await this.AuthenticateRoombaAsync(ipAddress, physicalAddress, response.RobotId);
            }

            client.Close();
        }
        catch (Exception ex)
        {
            this.logger.LogDebug(ex, "Failed robot discovery.");
            this.logger.LogWarning("Failed iRobot discovery.");
        }
    }

    public Task StopAsync(CancellationToken cancellationToken)
    {
        return Task.CompletedTask;
    }
}

internal class iRobotMcsResponse
{
    [JsonPropertyName("robotname")]
    public string? RobotName { get; set; }

    [JsonPropertyName("robotid")]
    public string? RobotId { get; set; }
}

internal class iRobotWorkerServiceConfiguration
{
    public List<RoombaConfiguration> RoombaRobots { get; } = new();

    public class RoombaConfiguration
    {
        public RoombaConfiguration(string ipAddress, string physicalAddress, string robotId, string robotPassword)
        {
            this.IpAddress = ipAddress;
            this.PhysicalAddress = physicalAddress;
            this.RobotId = robotId;
            this.RobotPassword = robotPassword;
        }

        public string IpAddress { get; set; }

        public string PhysicalAddress { get; }

        public string RobotId { get; }

        public string RobotPassword { get; }
    }
}

internal static class iRobotChannels
{
    public const string RoombaChannel = "irobot";
}

[Serializable]
internal class RoombaMqttStatusDto
{
    [JsonPropertyName("state")]
    public StateDto? State { get; set; }

    [Serializable]
    public class StateDto
    {
        [JsonPropertyName("reported")]
        public ReportedDto? Reported { get; set; }

        [Serializable]
        public class ReportedDto
        {
            [JsonPropertyName("name")] public string? Name { get; set; }

            [JsonPropertyName("batPct")] public double? BatteryPercentage { get; set; }

            [JsonPropertyName("cleanMissionStatus")]
            public CleanMissionStatusDto? CleanMissionStatus { get; set; }

            [JsonPropertyName("pose")] public PoseDto? Pose { get; set; }

            [JsonPropertyName("lastCommand")] public LastCommandDto? LastCommand { get; set; }

            [Serializable]
            public class LastCommandDto
            {
                [JsonPropertyName("command")] public string? Command { get; set; }

                [JsonPropertyName("ordered")] public int? Ordered { get; set; }

                [JsonPropertyName("pmap_id")] public string? MapId { get; set; }

                [JsonPropertyName("regions")] public List<RegionDto>? Regions { get; set; }

                [JsonPropertyName("user_pmapv_id")] public string? UserMapId { get; set; }

                [Serializable]
                public class RegionDto
                {
                    [JsonPropertyName("region_id")] public string? RegionId { get; set; }

                    [JsonPropertyName("type")] public string? Type { get; set; }
                }
            }

            [Serializable]
            public class CleanMissionStatusDto
            {
                [JsonPropertyName("cycle")] public string? Cycle { get; set; }

                [JsonPropertyName("phase")] public string? Phase { get; set; }

                [JsonPropertyName("error")] public int? Error { get; set; }

                [JsonPropertyName("notReady")] public int? NotReady { get; set; }
            }

            [Serializable]
            public class PoseDto
            {
                [JsonPropertyName("theta")] public double? Theta { get; set; }

                [JsonPropertyName("point")] public PointDto? Point { get; set; }

                [Serializable]
                public class PointDto
                {
                    [JsonPropertyName("x")] public double? X { get; set; }

                    [JsonPropertyName("y")] public double? Y { get; set; }
                }
            }
        }
    }
}
    
// TODO Separate robot from worker service
internal class RoombaControl
{
    private readonly iRobotWorkerServiceConfiguration.RoombaConfiguration config;
    private readonly IMqttClient client;

    public RoombaControl(
        IMqttClientFactory mqttClientFactory,
        iRobotWorkerServiceConfiguration.RoombaConfiguration config)
    {
        if (mqttClientFactory == null) throw new ArgumentNullException(nameof(mqttClientFactory));
        this.config = config ?? throw new ArgumentNullException(nameof(config));
        this.client = mqttClientFactory.Create();
    }
}