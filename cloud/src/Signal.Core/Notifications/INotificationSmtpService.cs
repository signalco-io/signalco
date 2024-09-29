using System.Threading;
using System.Threading.Tasks;

namespace Signal.Core.Notifications;

internal interface INotificationSmtpService
{
    Task SendAsync(
        string recipientEmail,
        string title,
        string content,
        string? sender = "system",
        CancellationToken cancellationToken = default);
}