using System.Collections.Generic;

namespace Signal.Beacon.Core.Network;

public interface IHostInfo
{
    string IpAddress { get; }

    long Ping { get; }

    IEnumerable<int> OpenPorts { get; }

    string? PhysicalAddress { get; init; }
}