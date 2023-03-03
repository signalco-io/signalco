using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Json;
using System.Net.NetworkInformation;
using System.Net.Sockets;
using System.Net.WebSockets;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Signal.Beacon.Core.Entity;
using Signal.Beacon.Core.Network;
using Websocket.Client;
using Timer = System.Timers.Timer;

namespace Signal.Beacon.Channel.Samsung;

internal class TvRemote : IDisposable
{
    public string? Id => this.configuration.Id;
    private IEntityDetails? entity = null;

    private readonly IEntityService entityService;
    private readonly IEntitiesDao entitiesDao;
    private readonly SamsungWorkerServiceConfiguration.SamsungTvRemoteConfig configuration;
    private readonly ILogger logger;
    private bool isReconnecting;
    private TvBasicInfoApiV2ResponseDto? tvBasicInfo;
    private CancellationToken cancellationToken;
    private Timer? periodicalChecksTimer;

    private bool isDiscovered;
    private bool isTvOn;
    private string? runningApp;

    private IWebsocketClient? client;
    private IDisposable? clientReconnectSubscription;
    private IDisposable? clientDisconnectSubscription;
    private IDisposable? clientMessageReceivedSubscription;

    public IEnumerable<string> remoteKeysList = new List<string>
    {
        "KEY_MENU",
        "KEY_HOME",
        "KEY_VOLUP",
        "KEY_VOLDOWN",
        "KEY_MUTE",
        "KEY_POWER",
        "KEY_GUIDE",
        "KEY_CHUP",
        "KEY_CHDOWN",
        "KEY_CH_LIST",
        "KEY_PRECH",
        "KEY_LEFT",
        "KEY_RIGHT",
        "KEY_UP",
        "KEY_DOWN",
        "KEY_ENTER",
        "KEY_RETURN",
        "KEY_TOOLS",
        "KEY_1",
        "KEY_2",
        "KEY_3",
        "KEY_4",
        "KEY_5",
        "KEY_6",
        "KEY_7",
        "KEY_8",
        "KEY_9",
        "KEY_0"
    };

    public TvRemote(
        IEntityService entityService,
        IEntitiesDao entitiesDao,
        SamsungWorkerServiceConfiguration.SamsungTvRemoteConfig configuration, 
        ILogger logger)
    {
        this.entityService = entityService ?? throw new ArgumentNullException(nameof(entityService));
        this.entitiesDao = entitiesDao ?? throw new ArgumentNullException(nameof(entitiesDao));
        this.configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
        this.logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    private void QueryInstalledApps()
    {
        if (this.client == null)
            throw new Exception("Client not connected.");

        this.client?.Send("{\"method\":\"ms.channel.emit\",\"params\":{\"event\":\"ed.installedApp.get\",\"to\":\"host\"}}");
    }

    public void OpenApp(string appId)
    {
        if (this.client == null)
            throw new Exception("Client not connected.");

        this.client.Send($"{{\"method\":\"ms.channel.emit\",\"params\":{{\"event\":\"ed.apps.launch\",\"to\":\"host\",\"data\":{{\"appId\":\"{appId}\", \"action_type\": \"DEEP_LINK\"}}}}}}");
    }

    public void KeyPress(string keyCode)
    {
        if (this.client == null)
            throw new Exception("Client not connected.");

        var command =
            $"{{\"method\":\"ms.remote.control\",\"params\":{{\"Cmd\":\"Click\",\"DataOfCmd\":\"{keyCode}\",\"Option\":\"false\",\"TypeOfRemote\":\"SendRemoteKey\"}}}}";
        this.client.Send(command);
    }

    public void WakeOnLan()
    {
        if (string.IsNullOrWhiteSpace(this.configuration.MacAddress) ||
            string.IsNullOrWhiteSpace(this.configuration.IpAddress))
            throw new Exception("MAC and IP address are required for WOL");

        IpHelper.SendWakeOnLan(
            PhysicalAddress.Parse(this.configuration.MacAddress),
            IPAddress.Parse(this.configuration.IpAddress));
    }

    public async void BeginConnectTv(CancellationToken connectionCancellationToken)
    {
        try
        {
            this.cancellationToken = connectionCancellationToken;

            await this.Disconnect();

            this.isReconnecting = false;

            // If TV is not ON, try again after one period (10s)
            if (!await this.CheckIsOnlineAsync())
            {
                this.ReconnectAfter(10000);
                return;
            }

            await this.RetrieveTvId();
            await this.ConnectWsRemoteAsync();

            this.periodicalChecksTimer = new Timer(30000);
            this.periodicalChecksTimer.Elapsed += (_, _) => this.DoPeriodicalTasks();
            this.periodicalChecksTimer.Start();
        }
        catch (HttpRequestException ex) when (ex.StatusCode == HttpStatusCode.RequestTimeout ||
                                              ex.InnerException 
                                                  is SocketException { SocketErrorCode: SocketError.TimedOut } 
                                                  or SocketException { SocketErrorCode: SocketError.ConnectionReset })
        {
            this.logger.LogDebug("TV Offline {TvIp}", this.configuration.IpAddress);
            this.ReconnectAfter();
        }
        catch (Exception ex)
        {
            this.logger.LogWarning(ex, "Failed to connect to TV {TvIp}", this.configuration.IpAddress);
            this.ReconnectAfter();
        }
    }

    private async void DoPeriodicalTasks()
    {
        if (!this.isDiscovered || this.Id == null || this.entity == null)
            return;

        // Try to get power state
        var isOnline = await this.CheckIsOnlineAsync();
        await this.ReportOnline(isOnline);

        if (this.isTvOn)
        {
            var runningApp = await this.GetRunningAppAsync();
            if (runningApp != null && runningApp != this.runningApp)
            {
                this.runningApp = runningApp;
                await this.entityService.ContactSetAsync(
                    new ContactPointer(this.entity.Id, SamsungChannels.SamsungChannel, "running-app"),
                    runningApp,
                    this.cancellationToken);
            }
        }
    }

    private async Task ReportOnline(bool isOnline)
    {
        if (isOnline == this.isTvOn) return;
        if (this.Id is null) return;
        if (this.entity is null) return;

        // Reset states
        if (!isOnline)
            this.isDiscovered = false;

        this.isTvOn = isOnline;

        await this.entityService.ContactSetAsync(
            new ContactPointer(this.entity.Id, SamsungChannels.SamsungChannel, "state"), 
            isOnline.ToString().ToLowerInvariant(), 
            this.cancellationToken);
    }

    private async Task ConnectWsRemoteAsync()
    {
        this.client = this.ConnectWsEndpoint(this.configuration.IpAddress, 8002,
            "/channels/samsung.remote.control", "Signalco", this.configuration.Token);
        this.client.MessageReceived.Subscribe(this.HandleTvRemoteMessage);
        await this.client.Start();
    }

    private async Task<string?> GetRunningAppAsync()
    {
        if (!this.isDiscovered || this.Id == null || this.entity == null)
            return null;

        return "Unknown";

        // TODO: Reimplement when available
        //var device = await this.devicesDao.GetAsync(this.Id, this.cancellationToken);
        //var appContact = device?.Contact(SamsungChannels.SamsungChannel, "openApp");
        //if (appContact?.DataValues == null) 
        //    return null;

        //var httpClient = new HttpClient();
        //foreach (var app in appContact.DataValues)
        //{
        //    try
        //    {
        //        var url = $"http://{this.configuration.IpAddress}:8001/api/v2/applications/{app.Value}";
        //        var status = await httpClient.GetFromJsonAsync<TvApplicationStatusDto>(url, this.cancellationToken);
        //        if (status?.Running ?? false)
        //            return app.Value;
        //    }
        //    catch (Exception ex) when (ex is TaskCanceledException or HttpRequestException)
        //    {
        //        this.logger.LogDebug("TV is offline. Can't get running application status");
        //        return null;
        //    }
        //    catch (Exception ex)
        //    {
        //        this.logger.LogDebug(ex, "Failed to get application {AppId} status", app.Value);
        //    }
        //}

        //return "Unknown";
    }

    private async Task<bool> CheckIsOnlineAsync()
    {
        try
        {
            return (await this.GetBasicInfoAsync())?.Device?.PowerState == "on";
        }
        catch
        {
            return false;
        }
    }

    private async Task RetrieveTvId()
    {
        this.tvBasicInfo = await this.GetBasicInfoAsync();
        if (this.tvBasicInfo?.Device != null)
            this.configuration.Id = this.tvBasicInfo.Device.Id;
    }

    private Task<TvBasicInfoApiV2ResponseDto?> GetBasicInfoAsync()
    {
        return new HttpClient().GetFromJsonAsync<TvBasicInfoApiV2ResponseDto>(
            $"http://{this.configuration.IpAddress}:8001/api/v2/", this.cancellationToken);
    }

    private async void ReconnectAfter(double delayMs = 30000)
    {
        if (this.isReconnecting) return;

        await this.ReportOnline(false);

        _ = Task.Run(async () =>
        {
            await this.Disconnect();
            await Task.Delay(TimeSpan.FromMilliseconds(delayMs), this.cancellationToken);
            this.BeginConnectTv(this.cancellationToken);
        }, this.cancellationToken);
    }

    private async Task Disconnect()
    {
        try
        {
            if (this.client?.IsStarted ?? false)
                this.logger.LogDebug("Disconnecting Websocket for {TvIp}...", this.configuration.IpAddress);

            this.periodicalChecksTimer?.Stop();
            this.periodicalChecksTimer = null;

            this.isReconnecting = true;
            if (this.client != null)
            {
                try
                {
                    this.clientDisconnectSubscription?.Dispose();
                    this.clientMessageReceivedSubscription?.Dispose();
                    this.clientReconnectSubscription?.Dispose();

                    if (this.client.IsRunning)
                        await this.client.Stop(WebSocketCloseStatus.NormalClosure, "Disconnect initiated.");
                }
                catch (Exception ex)
                {
                    this.logger.LogDebug(ex, "Failed to stop client for TV connection {TvIp}", this.configuration.IpAddress);
                }

                this.client?.Dispose();
            }
        }
        catch (Exception ex)
        {
            this.logger.LogWarning(ex, "Failed to dispose the TV connection {TvIp}", this.configuration.IpAddress);
        }
    }

    private async void HandleTvRemoteMessage(ResponseMessage message)
    {
        try
        {
            this.logger.LogTrace("Received: {Message}", message.Text);
            var response = JsonSerializer.Deserialize<TvWsResponseDto>(message.Text);

            // Acquire token procedure
            if (!this.isDiscovered && response?.Data?.Token != null)
            {
                var token = response.Data?.Token;
                if (string.IsNullOrWhiteSpace(token)) return;

                // Persist acquired token
                this.configuration.Token = token;

                // Reconnect using token
                this.client?.Dispose();
                this.BeginConnectTv(this.cancellationToken);
            }

            // Dispatch discovered when token is acquired
            if (!this.isDiscovered && 
                this.configuration.Token != null && 
                !string.IsNullOrWhiteSpace(this.Id) &&
                this.tvBasicInfo?.Device != null)
            {
                this.entity = (await this.entitiesDao.GetByContactValueAsync(
                    SamsungChannels.SamsungChannel,
                    "remote-id",
                    this.Id,
                    this.cancellationToken)).FirstOrDefault();
                if (this.entity != null)
                {
                    var newEntityId = await this.entityService.UpsertAsync(
                        EntityType.Device,
                        null,
                        this.tvBasicInfo.Device.Name ?? this.Id,
                        this.cancellationToken);
                    await this.entityService.ContactSetAsync(
                        new ContactPointer(
                            newEntityId,
                            SamsungChannels.SamsungChannel,
                            "remote-id"),
                        this.Id,
                        this.cancellationToken);
                    await this.entityService.ContactSetAsync(
                        new ContactPointer(
                            newEntityId,
                            SamsungChannels.SamsungChannel,
                            "model-name"),
                        this.tvBasicInfo.Device.ModelName,
                        this.cancellationToken);
                    this.entity = await this.entitiesDao.GetAsync(newEntityId, this.cancellationToken);
                    if (this.entity == null)
                        throw new Exception($"Failed to configure TV {this.Id}");
                }

                if (this.entity != null)
                {
                    await this.entityService.ContactSetAsync(
                        new ContactPointer(this.entity.Id, SamsungChannels.SamsungChannel, "state"),
                        null,
                        this.cancellationToken);
                    await this.entityService.ContactSetAsync(
                        new ContactPointer(this.entity.Id, SamsungChannels.SamsungChannel, "keypress"),
                        null,
                        this.cancellationToken);
                    await this.entityService.ContactSetAsync(
                        new ContactPointer(this.entity.Id, SamsungChannels.SamsungChannel, "running-app"),
                        null,
                        this.cancellationToken);
                }

                this.isDiscovered = true;

                this.QueryInstalledApps();
                this.DoPeriodicalTasks();
            }

            if (this.isDiscovered && 
                this.Id != null &&
                response?.Event == "ed.installedApp.get")
            {
                var availableApps = response.Data?.Data?
                    .Where(app => !string.IsNullOrWhiteSpace(app.AppId))
                    .Select(app =>
                        new
                        {
                            Id = app.AppId!,
                            app.Name
                        })
                    .ToList();

                if (this.Id != null && (availableApps?.Any() ?? false) && this.entity != null)
                {
                    await this.entityService.ContactSetAsync(
                        new ContactPointer(this.entity.Id, SamsungChannels.SamsungChannel, "open-app"), null,
                        this.cancellationToken);
                }
            }
        }
        catch (Exception ex)
        {
            this.logger.LogDebug("Remote message: {Message}", message.Text);
            this.logger.LogWarning(ex, "Failed to handle remote message.");
        }
    }

    private IWebsocketClient ConnectWsEndpoint(string ipAddress, int port, string url, string name, string? token)
    {
        const string wsUrl = "wss://{0}:{1}/api/v2{2}?name={3}";
        string urlFormat = wsUrl;
        if (!string.IsNullOrWhiteSpace(token))
        {
            urlFormat += "&token=" + token;
        }

        var wsClient = new WebsocketClient(
            new Uri(string.Format(urlFormat, ipAddress, port, url, Convert.ToBase64String(Encoding.UTF8.GetBytes(name)))),
            () => new ClientWebSocket { Options = { RemoteCertificateValidationCallback = (_, _, _, _) => true } })
        {
            ReconnectTimeout = TimeSpan.FromSeconds(30),
            IsReconnectionEnabled = false
        };

        this.clientReconnectSubscription = wsClient.ReconnectionHappened.Subscribe(info =>
            this.logger.LogDebug("Reconnection happened {TvIp}, type: {Type}", this.configuration.IpAddress, info.Type));
        this.clientDisconnectSubscription = wsClient.DisconnectionHappened.Subscribe(info =>
        {
            this.logger.LogDebug("DisconnectionHappened {TvIp}, type: {Type}", this.configuration.IpAddress, info.Type);
            this.ReconnectAfter();
        });
        this.clientMessageReceivedSubscription = wsClient.MessageReceived.Subscribe(msg =>
            this.logger.LogTrace("Message received from {TvIp}: {Message}", this.configuration.IpAddress, msg.Text));

        return wsClient;
    }

    [Serializable]
    private class TvWsResponseDto
    {
        [JsonPropertyName("data")]
        public DataDto? Data { get; set; }

        [JsonPropertyName("event")]
        public string? Event { get; set; }

        [Serializable]
        public class DataDto
        {
            [JsonPropertyName("token")]
            public string? Token { get; set; }

            [JsonPropertyName("data")]
            public IEnumerable<MiscDataDto>? Data { get; set; }

            [Serializable]
            public class MiscDataDto
            {
                [JsonPropertyName("appId")]
                public string? AppId { get; set; }

                [JsonPropertyName("name")]
                public string? Name { get; set; }
            }
        }
    }

    [Serializable]
    private class TvApplicationStatusDto
    {
        [JsonPropertyName("running")]
        public bool? Running { get; set; }
    }

    [Serializable]
    private class TvBasicInfoApiV2ResponseDto
    {
        public DeviceDto? Device { get; set; }

        public record DeviceDto(string? Id, string? Name, string? ModelName, string? PowerState);
    }

    public void Dispose()
    {
        _ = this.Disconnect();
    }
}