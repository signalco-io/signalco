using System.Threading;
using System.Threading.Tasks;

namespace Signal.Beacon.Application.Signal.SignalR;

public interface ISignalSignalRHubClient
{
    Task StartAsync(CancellationToken cancellationToken);
}