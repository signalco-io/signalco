using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Signal.Beacon.Core.Conducts;
using Signal.Beacon.Core.Configuration;
using Signal.Beacon.Core.Entity;
using Signal.Beacon.Core.Network;
using Signal.Beacon.Core.Workers;

namespace Signal.Beacon.Channel.Samsung;

internal class SamsungWorkerService : IWorkerService, IWorkerServiceWithDiscovery
{
    private readonly string[] allowedMacCompanies =
    {
        "Samsung Electronics Co.,Ltd"
    };

    private readonly IEntityService entityService;
    private readonly IEntitiesDao entitiesDao;
    private readonly IHostInfoService hostInfoService;
    private readonly IMacLookupService macLookupService;
    private readonly IChannelConfigurationService configurationService;
    private readonly IConductSubscriberClient conductSubscriberClient;
    private readonly ILogger<SamsungWorkerService> logger;
    private SamsungWorkerServiceConfiguration? configuration;
    private readonly List<TvRemote> tvRemotes = new();
    private CancellationToken startCancellationToken;
    private string? channelId;

    public SamsungWorkerService(
        IEntityService entityService,
        IEntitiesDao entitiesDao,
        IHostInfoService hostInfoService,
        IMacLookupService macLookupService,
        IChannelConfigurationService configurationService,
        IConductSubscriberClient conductSubscriberClient,
        ILogger<SamsungWorkerService> logger)
    {
        this.entityService = entityService ?? throw new ArgumentNullException(nameof(entityService));
        this.entitiesDao = entitiesDao ?? throw new ArgumentNullException(nameof(entitiesDao));
        this.hostInfoService = hostInfoService ?? throw new ArgumentNullException(nameof(hostInfoService));
        this.macLookupService = macLookupService ?? throw new ArgumentNullException(nameof(macLookupService));
        this.configurationService = configurationService ?? throw new ArgumentNullException(nameof(configurationService));
        this.conductSubscriberClient = conductSubscriberClient ?? throw new ArgumentNullException(nameof(conductSubscriberClient));
        this.logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }


    public async Task StartAsync(string entityId, CancellationToken cancellationToken)
    {
        this.channelId = entityId;
        this.startCancellationToken = cancellationToken;
        this.configuration =
            await this.configurationService.LoadAsync<SamsungWorkerServiceConfiguration>(
                entityId,
                SamsungChannels.SamsungChannel,
                cancellationToken);
            
        this.configuration.TvRemotes.ForEach(this.ConnectTv);

        this.conductSubscriberClient.Subscribe(SamsungChannels.SamsungChannel, this.SamsungConductHandler);
    }

    private async Task SamsungConductHandler(IEnumerable<IConduct> conducts, CancellationToken cancellationToken)
    {
        foreach (var conduct in conducts)
        {
            try
            {
                var entity = await this.entitiesDao.GetAsync(conduct.Pointer.EntityId, cancellationToken);
                var remoteId = entity?.Contact(SamsungChannels.SamsungChannel, "remote-id")?.ValueSerialized;
                var matchedRemote = this.tvRemotes.FirstOrDefault(r => r.Id == remoteId);
                if (matchedRemote == null)
                    throw new Exception($"No matching remote found for target {conduct.Pointer.EntityId}");

                switch (conduct.Pointer.ContactName)
                {
                    case "keypress":
                        matchedRemote.KeyPress(conduct.ValueSerialized ??
                                               throw new ArgumentException(
                                                   $"Invalid conduct value ${conduct.ValueSerialized}"));
                        break;
                    case "openApp":
                        matchedRemote.OpenApp(conduct.ValueSerialized ??
                                              throw new ArgumentException(
                                                  $"Invalid conduct value ${conduct.ValueSerialized}"));
                        break;
                    case "state":
                    {
                        var boolString = conduct.ValueSerialized?.ToLowerInvariant();
                        if (boolString != "true" && boolString != "false")
                            throw new Exception("Invalid contact value type. Expected boolean.");

                        // To turn on use WOL, to turn off use power key
                        if (boolString == "true")
                            matchedRemote.WakeOnLan();
                        else matchedRemote.KeyPress("KEY_POWER");
                        break;
                    }
                    default:
                        throw new ArgumentOutOfRangeException($"Unsupported contact {conduct.Pointer.ContactName}");
                }
            }
            catch (Exception ex)
            {
                this.logger.LogTrace(ex, "Failed to execute conduct {@Conduct}", conduct);
                this.logger.LogWarning("Failed to execute conduct {@Conduct}", conduct);
            }
        }
    }

    private async Task DiscoverDevices(CancellationToken cancellationToken)
    {
        this.logger.LogInformation("Samsung discovering hosts...");

        var ipAddressesInRange = IpHelper.GetIPAddressesInRange(IpHelper.GetLocalIp());
        var matchedHosts = await this.hostInfoService.HostsAsync(ipAddressesInRange, new[] {8001}, cancellationToken);

        this.logger.LogInformation("Samsung matching hosts...");
        foreach (var hostInfo in matchedHosts)
        {
            // Ignore if no open ports
            if (!hostInfo.OpenPorts.Any()) continue;

            if (string.IsNullOrWhiteSpace(hostInfo.PhysicalAddress))
            {
                this.logger.LogDebug("Device MAC not found. Ip: {IpAddress}", hostInfo.IpAddress);
                continue;
            }

            var deviceCompany =
                await this.macLookupService.CompanyNameLookupAsync(hostInfo.PhysicalAddress, cancellationToken);
            if (!this.allowedMacCompanies.Contains(deviceCompany))
            {
                this.logger.LogDebug(
                    "Device MAC not whitelisted. Ip: {IpAddress} Mac: {PhysicalAddress} Company: {MacCompany}",
                    hostInfo.PhysicalAddress, hostInfo.IpAddress, deviceCompany ?? "Not found");
                continue;
            }

            // TODO: Add to possible matches
            this.logger.LogDebug("Potential Samsung TV Remote device found on address \"{DeviceIp}\"",
                hostInfo.IpAddress);

            // Try to connect
            var newTvRemoteConfig = new SamsungWorkerServiceConfiguration.SamsungTvRemoteConfig(hostInfo.IpAddress)
            {
                MacAddress = hostInfo.PhysicalAddress
            };
            this.configuration?.TvRemotes.Add(newTvRemoteConfig);
            this.ConnectTv(newTvRemoteConfig);
        }

        this.logger.LogInformation("Samsung discovering done");
    }

    private void ConnectTv(SamsungWorkerServiceConfiguration.SamsungTvRemoteConfig remoteConfig)
    {
        var remote = new TvRemote(this.entityService, this.entitiesDao, remoteConfig, this.logger);
        remote.BeginConnectTv(this.startCancellationToken);
        this.tvRemotes.Add(remote);
    }

    public async Task StopAsync()
    {
        if (this.channelId != null)
            await this.configurationService.SaveAsync(this.channelId, SamsungChannels.SamsungChannel, this.configuration, CancellationToken.None);
    }

    public async Task BeginDiscoveryAsync(CancellationToken cancellationToken)
    {
        await this.DiscoverDevices(cancellationToken);
    }
}