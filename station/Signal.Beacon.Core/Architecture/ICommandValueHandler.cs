using System.Threading;
using System.Threading.Tasks;

namespace Signal.Beacon.Core.Architecture;

public interface ICommandValueHandler<in T, TValue> where T : ICommand
{
    Task<TValue> HandleAsync(T command, CancellationToken cancellationToken);
}