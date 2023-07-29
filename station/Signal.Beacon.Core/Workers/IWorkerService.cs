using System.Threading;
using System.Threading.Tasks;

namespace Signal.Beacon.Core.Workers;

public interface IWorkerService
{
    Task StartAsync(string entityId, CancellationToken cancellationToken);

    Task StopAsync();
}