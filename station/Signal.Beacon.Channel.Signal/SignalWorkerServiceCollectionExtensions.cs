using Microsoft.Extensions.DependencyInjection;
using Signal.Beacon.Core.Workers;

namespace Signal.Beacon.Channel.Signal;

public static class SignalWorkerServiceCollectionExtensions
{
    public static IServiceCollection AddSignal(this IServiceCollection services) =>
        services
            .AddTransient<IWorkerServiceRegistration, SignalcoWorkerServiceRegistration>()
            .AddTransient<SignalWorkerService>();
}