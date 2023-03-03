using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.NetworkInformation;
using System.Net.Sockets;
using System.Text.RegularExpressions;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Signal.Beacon.Core.Network;

namespace Signal.Beacon.Application.Network;

public class HostInfoService : IHostInfoService
{
    private readonly ILogger<HostInfoService> logger;

    public HostInfoService(
        ILogger<HostInfoService> logger)
    {
        this.logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<IEnumerable<IHostInfo>> HostsAsync(
        IEnumerable<string> ipAddresses,
        int[] scanPorts,
        CancellationToken cancellationToken)
    {
        this.logger.LogDebug("Hosts scanning initiated...");

        var arpResult = (await ArpLookupAsync().ConfigureAwait(false)).ToList();
        var pingResults = new List<IHostInfo>();
        var aliveHosts = await this.GetAliveHostsAsync(ipAddresses).ConfigureAwait(false);
        foreach (var aliveHost in aliveHosts)
        {
            var arpLookupResult = arpResult.FirstOrDefault(a => a.ip == aliveHost.ipAddress);
            var hostInfo = await this.GetHostInformationAsync(
                aliveHost.ipAddress,
                aliveHost.ping,
                scanPorts,
                arpLookupResult.physical,
                cancellationToken).ConfigureAwait(false);

            // Ignore if info not retrieved
            if (hostInfo == null)
            {
                this.logger.LogTrace("HostInfo {IpAddress}: None", aliveHost);
                continue;
            }

            this.logger.LogTrace("HostInfo {IpAddress}: {@HostInfo}", aliveHost, hostInfo);
            pingResults.Add(hostInfo);
        }

        this.logger.LogDebug("Alive hosts found: {HostCount}", pingResults.Count);
        this.logger.LogDebug("Alive hosts: {@Host}", pingResults);

        return pingResults;
    }

    private async Task<string?> ResolveHostNameAsync(string ipAddress, CancellationToken cancellationToken)
    {
        try
        {
            var entry = await Dns.GetHostEntryAsync(ipAddress, cancellationToken).ConfigureAwait(false);
            return entry.HostName;
        }
        catch
        {
            return null;
        }
    }

    private async Task<IEnumerable<(string ipAddress, long ping)>> GetAliveHostsAsync(IEnumerable<string> ipAddresses)
    {
        var alive = new List<(string ipAddress, long ping)>();
        await Parallel.ForEachAsync(
            ipAddresses,
            new ParallelOptions {MaxDegreeOfParallelism = 3},
            async (ipAddress, token) =>
            {
                var ping = await this.PingIpAddressAsync(ipAddress, token).ConfigureAwait(false);
                if (ping != null)
                    alive.Add((ipAddress, ping.Value));
            }).ConfigureAwait(false);
        return alive;
    }

    private async Task<HostInfo?> GetHostInformationAsync(
        string address, 
        long ping,
        IEnumerable<int> applicablePorts, 
        string? arpLookupPhysical,
        CancellationToken cancellationToken)
    {
        var portPing = Math.Min(3000, Math.Max(500, ping * 100)); // Adaptive port connection timeout based on ping value
        var openPorts = OpenPorts(address, applicablePorts, TimeSpan.FromMilliseconds(portPing)).ToList();
        var hostName = await this.ResolveHostNameAsync(address, cancellationToken).ConfigureAwait(false);

        return new HostInfo(address, ping)
        {
            OpenPorts = openPorts,
            PhysicalAddress = arpLookupPhysical,
            HostName = hostName
        };
    }

    private static async Task<IEnumerable<(string ip, string physical)>> ArpLookupAsync()
    {
        try
        {
            System.Diagnostics.Process pProcess = new()
            {
                StartInfo =
                {
                    FileName = "arp",
                    Arguments = "-a ",
                    UseShellExecute = false,
                    RedirectStandardOutput = true,
                    CreateNoWindow = true
                }
            };
            pProcess.Start();
            var cmdOutput = await pProcess.StandardOutput.ReadToEndAsync().ConfigureAwait(false);

            // Regex supports following outputs:
            // Windows (10): 192.168.0.1           00-00-00-00-00-00     dynamic
            // Ubuntu (20):  HOSTNAME (192.168.0.1) at 00:00:00:00:00:00 [ether] on eth0
            const string pattern = @"\(*(?<ip>([0-9]{1,3}\.?){4})\)*\s*(at)*\s*(?<mac>([a-f0-9]{2}(-|:)?){6})";
            var pairs = new List<(string ip, string physical)>();
            foreach (Match m in Regex.Matches(cmdOutput, pattern, RegexOptions.IgnoreCase))
            {
                pairs.Add(
                    (
                        m.Groups["ip"].Value,
                        m.Groups["mac"].Value.Replace("-", ":")
                    ));
            }

            return pairs;
        }
        catch
        {
            return Enumerable.Empty<(string ip, string physical)>();
        }
    }

    private async Task<long?> PingIpAddressAsync(string address, CancellationToken cancellationToken, int timeout = 1000, int retry = 2)
    {
        using var ping = new Ping();
        var tryCount = 0;

        while (tryCount++ < retry && !cancellationToken.IsCancellationRequested)
        {
            try
            {
                var result = await ping.SendPingAsync(address, timeout).ConfigureAwait(false);
                if (result.Status == IPStatus.Success)
                {
                    this.logger.LogTrace("Host {HostIp} alive ({Roundtrip}ms)", address, result.RoundtripTime);
                    return result.RoundtripTime;
                }
            }
            catch
            {
                // Do nothing
            }
        }

        this.logger.LogTrace("Host {HostIp} dead", address);

        return null;
    }

    private static IEnumerable<int> OpenPorts(string host, IEnumerable<int> ports, TimeSpan timeout)
    {
        var openPorts = new List<int>();

        Parallel.ForEach(ports, new ParallelOptions {MaxDegreeOfParallelism = 3}, port =>
        {
            try
            {
                using var client = new TcpClient();
                var result = client.BeginConnect(host, port, null, null);
                var success = result.AsyncWaitHandle.WaitOne(timeout);
                client.EndConnect(result);
                if (success)
                {
                    openPorts.Add(port);
                }
            }
            catch
            {
                // Not open
            }
        });

        return openPorts;
    }
}