using System.Threading;
using System.Threading.Tasks;

namespace Signal.Beacon.Core.Workers;

public interface IWorkerServiceWithDiscovery
{
    Task BeginDiscoveryAsync(CancellationToken cancellationToken);
}