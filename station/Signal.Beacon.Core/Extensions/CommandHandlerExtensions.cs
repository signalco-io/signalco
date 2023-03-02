using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Signal.Beacon.Core.Architecture;

namespace Signal.Beacon.Core.Extensions;

public static class CommandHandlerExtensions
{
    public static Task HandleManyAsync<T>(this ICommandHandler<T> handler, CancellationToken cancellationToken, params T[] commands) where T : ICommand => 
        Task.WhenAll(commands.Select(command => handler.HandleAsync(command, cancellationToken)));
}