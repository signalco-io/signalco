using Microsoft.Extensions.DependencyInjection;
using Signal.Beacon.Core.Workers;

namespace Signal.Beacon.Channel.Tasmota;

public static class TasmotaWorkerServiceCollectionExtensions
{
    public static IServiceCollection AddTasmota(this IServiceCollection services)
    {
        return services
            .AddTransient<IWorkerService, TasmotaWorkerService>();
    }
}