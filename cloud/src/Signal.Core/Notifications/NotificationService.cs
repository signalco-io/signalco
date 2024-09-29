using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Signal.Core.Users;

namespace Signal.Core.Notifications;

internal class NotificationService(
        INotificationSmtpService smtpService,
        IUserService userService)
    : INotificationService
{
    public async Task CreateAsync(
        IEnumerable<string> userIds, 
        NotificationContent content, 
        NotificationOptions? options,
        CancellationToken cancellationToken = default)
    {
        foreach (var userId in userIds)
        {
            try
            {
                var user = await userService.GetPublicAsync(userId, cancellationToken);

                // Send email if requested with options (opt-in)
                if (options?.SendEmail ?? false)
                {
                    await smtpService.SendAsync(
                        user?.Email ??
                        throw new InvalidOperationException($"Email not available for user {userId}"),
                        content.Title,
                        content.Content?.ToString() ?? string.Empty,
                        cancellationToken: cancellationToken);
                }
            }
            catch
            {
                // TODO: Log
            }
        }
    }
}