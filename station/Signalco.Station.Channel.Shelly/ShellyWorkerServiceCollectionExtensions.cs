using Microsoft.Extensions.DependencyInjection;
using Signal.Beacon.Core.Workers;

namespace Signalco.Station.Channel.Shelly;

public static class ShellyWorkerServiceCollectionExtensions
{
    public static IServiceCollection AddShelly(this IServiceCollection services) =>
        services
            .AddTransient<IWorkerServiceRegistration, ShellyWorkerServiceRegistration >()
            .AddTransient<ShellyWorkerService>();
}