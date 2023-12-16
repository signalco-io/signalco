using Microsoft.Extensions.DependencyInjection;
using Signal.Api.Common.SignalR;
using Signal.Core.Notifications;

namespace Signal.Api.Common;

public static class ApiCommonExtensions
{
    public static IServiceCollection AddApi(this IServiceCollection services)
    {
        return services
            .AddTransient<ISignalRService, SignalRService>()
            .AddSingleton<ISignalRHubContextProvider, SignalRHubContextProvider>();
    }
}