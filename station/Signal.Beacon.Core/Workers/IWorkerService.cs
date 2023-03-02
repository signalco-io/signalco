using System.Threading;
using System.Threading.Tasks;

namespace Signal.Beacon.Core.Workers;

public interface IWorkerService
{
    Task StartAsync(CancellationToken cancellationToken);

    Task StopAsync(CancellationToken cancellationToken);
}