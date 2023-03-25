using System.Threading;
using System.Threading.Tasks;

namespace Signal.Beacon.Application;

internal interface IInternalWorkerService
{
    Task StartAsync(CancellationToken cancellationToken);

    Task StopAsync(CancellationToken cancellationToken);
}