using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Signal.Core.Notifications;

public interface INotificationService
{
    Task CreateAsync(
        IEnumerable<string> userIds,
        NotificationContent content,
        NotificationOptions? options,
        CancellationToken cancellationToken = default);
}