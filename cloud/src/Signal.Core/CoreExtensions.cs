using System;
using Microsoft.Extensions.DependencyInjection;
using Signal.Core.Auth;
using Signal.Core.Entities;
using Signal.Core.Notifications;
using Signal.Core.Sharing;
using Signal.Core.Users;

namespace Signal.Core;

public static class CoreExtensions
{
    public static IServiceCollection AddCore(this IServiceCollection services) =>
        services
            .AddTransient<INotificationSmtpService, NotificationEmailService>()
            .AddTransient<INotificationService, NotificationService>()
            .AddTransient<ISharingService, SharingService>()
            .AddTransient<IEntityService, EntityService>()
            .AddTransient<IUserService, UserService>()
            .AddTransient<IPatService, PatService>()
            .AddTransient(typeof(Lazy<>), typeof(LazyInstance<>));
}

public class LazyInstance<T>(IServiceProvider serviceProvider) : Lazy<T>(serviceProvider.GetRequiredService<T>)
    where T : notnull;