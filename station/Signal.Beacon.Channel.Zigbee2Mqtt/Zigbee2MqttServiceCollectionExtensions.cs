using System;
using Microsoft.Extensions.DependencyInjection;
using Signal.Beacon.Core.Workers;

namespace Signal.Beacon.Channel.Zigbee2Mqtt;

internal sealed class Zigbee2MqttWorkerServiceRegistration : IWorkerServiceRegistration
{
    public string ChannelName => Zigbee2MqttChannels.DeviceChannel;

    public Type WorkerServiceType => typeof(Zigbee2MqttWorkerService);
}

public static class Zigbee2MqttServiceCollectionExtensions
{
    public static IServiceCollection AddZigbee2Mqtt(this IServiceCollection services)
    {
        return services
            .AddTransient<IWorkerServiceRegistration, Zigbee2MqttWorkerServiceRegistration>()
            .AddTransient<Zigbee2MqttWorkerService>();
    }
}