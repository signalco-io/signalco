using Microsoft.Extensions.DependencyInjection;

namespace Signal.Beacon.Core.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddSingleton<TInterface1, TInterface2, TImpl>(this IServiceCollection services) 
        where TImpl : class, TInterface1, TInterface2 
        where TInterface1 : class
        where TInterface2 : class =>
        services
            .AddSingleton<TImpl>()
            .AddSingleton<TInterface1>(x => x.GetRequiredService<TImpl>())
            .AddSingleton<TInterface2>(x => x.GetRequiredService<TImpl>());
}