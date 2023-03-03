using System.Threading;
using System.Threading.Tasks;

namespace Signal.Beacon.Core.Shell;

public interface IShellService
{
    Task ExecuteShellCommandAsync(string command, CancellationToken cancellationToken);
}