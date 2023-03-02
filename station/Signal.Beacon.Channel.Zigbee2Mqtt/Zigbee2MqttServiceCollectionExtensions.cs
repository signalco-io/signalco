using Microsoft.Extensions.DependencyInjection;
using Signal.Beacon.Core.Workers;

namespace Signal.Beacon.Channel.Zigbee2Mqtt;

public static class Zigbee2MqttServiceCollectionExtensions
{
    public static IServiceCollection AddZigbee2Mqtt(this IServiceCollection services)
    {
        return services
            .AddSingleton<IWorkerService, Zigbee2MqttWorkerService>();
    }
}