using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Signal.Core.Users;

namespace Signal.Core.Notifications;

internal class NotificationService : INotificationService
{
    private readonly INotificationSmtpService smtpService;
    private readonly IUserService userService;

    public NotificationService(
        INotificationSmtpService smtpService,
        IUserService userService)
    {
        this.smtpService = smtpService ?? throw new ArgumentNullException(nameof(smtpService));
        this.userService = userService ?? throw new ArgumentNullException(nameof(userService));
    }

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
                var user = await this.userService.GetPublicAsync(userId, cancellationToken);

                // Send email if requested with options (opt-in)
                if (options?.SendEmail ?? false)
                {
                    await this.smtpService.SendAsync(
                        user?.Email ??
                        throw new InvalidOperationException($"Email not available for user {userId}"),
                        content.Title,
                        content.Content?.ToString() ?? string.Empty,
                        cancellationToken);
                }
            }
            catch
            {
                // TODO: Log
            }
        }
    }
}