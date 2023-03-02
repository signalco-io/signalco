using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Signal.Beacon.Core.Mqtt;
using Signal.Beacon.Core.Network;

namespace Signal.Beacon.Application.Mqtt;

public class MqttDiscoveryService : IMqttDiscoveryService
{
    private readonly IHostInfoService hostInfoService;
    private readonly IMqttClientFactory clientFactory;
    private readonly ILogger<MqttDiscoveryService> logger;

    public MqttDiscoveryService(
        IHostInfoService hostInfoService,
        IMqttClientFactory clientFactory,
        ILogger<MqttDiscoveryService> logger)
    {
        this.hostInfoService = hostInfoService ?? throw new ArgumentNullException(nameof(hostInfoService));
        this.clientFactory = clientFactory ?? throw new ArgumentNullException(nameof(clientFactory));
        this.logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }


    public async Task<IEnumerable<IHostInfo>> DiscoverMqttBrokerHostsAsync(
        string expectedTopic,
        CancellationToken cancellationToken)
    {
        var hosts = new List<IHostInfo>();

        try
        {
            var ipAddressesInRange = IpHelper.GetIPAddressesInRange(IpHelper.GetLocalIp());
            var applicableHosts = await this.hostInfoService.HostsAsync(
                ipAddressesInRange.Concat(new[] { "localhost" }),
                new[] { 1883 }, cancellationToken);

            // TODO: Discover all in parallel
            foreach (var applicableHost in applicableHosts)
            {
                try
                {
                    // Ignore if no open ports
                    if (!applicableHost.OpenPorts.Any()) continue;

                    this.logger.LogInformation("Discovered possible MQTT broker on {IpAddress}. Connecting...",
                        applicableHost.IpAddress);

                    using var client = this.clientFactory.Create();

                    // Start client with broker applicant
                    await client.StartAsync(
                        "Signal.Beacon.MQTTDiscovery", 
                        applicableHost.IpAddress,
                        cancellationToken);

                    // Subscribe to expected topic
                    var didReceiveExpectedTopisMessageTask = new TaskCompletionSource();
                    await client.SubscribeAsync(expectedTopic, _ =>
                    {
                        this.logger.LogDebug(
                            "MQTT broker responded with expected topic on {IpAddress}",
                            applicableHost.IpAddress);

                        didReceiveExpectedTopisMessageTask.TrySetResult();
                        return Task.CompletedTask;
                    });

                    // Wait for topic message or timeout
                    await Task.WhenAny(
                        Task.Delay(2000, cancellationToken),
                        didReceiveExpectedTopisMessageTask.Task);

                    // Stop client
                    await client.StopAsync(cancellationToken);

                    // Add to list if topic message received
                    if (didReceiveExpectedTopisMessageTask.Task.IsCompletedSuccessfully)
                        hosts.Add(applicableHost);
                }
                catch (Exception ex)
                {
                    this.logger.LogWarning(
                        ex,
                        "MQTT broker discovery failed for broker on {IpAddress}.",
                        applicableHost.IpAddress);
                }
            }
        }
        catch (Exception ex)
        {
            this.logger.LogWarning(ex, "MQTT broker discovery failed.");
        }

        return hosts;
    }
}