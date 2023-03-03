using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Signal.Core.Notifications;

public interface ISignalRService
{
    Task SendToUsersAsync(
        IReadOnlyList<string> userIds,
        string hubName,
        string target,
        object[] arguments,
        CancellationToken cancellationToken = default);
}