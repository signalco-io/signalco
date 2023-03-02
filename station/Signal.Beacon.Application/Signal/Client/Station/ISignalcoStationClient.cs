using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Signal.Beacon.Core.Signal;

namespace Signal.Beacon.Application.Signal.Client.Station;

public interface ISignalcoStationClient
{
    Task LogAsync(string stationId, IEnumerable<ISignalcoStationLoggingEntry> entries, CancellationToken cancellationToken);
}