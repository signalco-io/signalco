using Microsoft.Extensions.DependencyInjection;
using Signal.Beacon.Core.Workers;

namespace Signal.Beacon.Channel.PhilipsHue;

public static class PhilipsHueServiceCollectionExtensions
{
    public static IServiceCollection AddPhilipsHue(this IServiceCollection services)
    {
        return services.AddSingleton<IWorkerService, PhilipsHueWorkerService>();
    }
}