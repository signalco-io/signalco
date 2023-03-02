using Microsoft.Extensions.DependencyInjection;
using Signal.Beacon.Core.Workers;

namespace Signal.Beacon.Channel.Samsung;

public static class SamsungServiceCollectionExtensions
{
    public static IServiceCollection AddSamsung(this IServiceCollection services)
    {
        return services
            .AddSingleton<IWorkerService, SamsungWorkerService>();
    }
}