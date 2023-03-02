using System.Threading;
using System.Threading.Tasks;

namespace Signal.Beacon.Core.Architecture;

public interface ICommandHandler<in T> where T : ICommand
{
    Task HandleAsync(T command, CancellationToken cancellationToken);
}