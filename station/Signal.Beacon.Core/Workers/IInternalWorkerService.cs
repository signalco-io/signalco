using System.Threading;
using System.Threading.Tasks;

namespace Signal.Beacon.Core.Workers;

public interface IInternalWorkerService
{
    Task StartAsync(CancellationToken cancellationToken);

    Task StopAsync();
}