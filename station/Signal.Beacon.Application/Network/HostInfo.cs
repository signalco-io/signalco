using System.Collections.Generic;
using System.Linq;
using Signal.Beacon.Core.Network;

namespace Signal.Beacon.Application.Network;

public class HostInfo : IHostInfo
{
    public string IpAddress { get; }

    public long Ping { get; }

    public IEnumerable<int> OpenPorts { get; init; } = Enumerable.Empty<int>();

    public string? PhysicalAddress { get; init; }

    public string? HostName { get; init; }

    public HostInfo(string ipAddress, long ping)
    {
        this.IpAddress = ipAddress;
        this.Ping = ping;
    }

    public override string ToString()
    {
        return $"{this.IpAddress} ({this.Ping}ms): {string.Join(", ", this.OpenPorts)}";
    }
}