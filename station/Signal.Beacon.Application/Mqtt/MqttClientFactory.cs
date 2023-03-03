using System;
using Microsoft.Extensions.DependencyInjection;
using Signal.Beacon.Core.Mqtt;

namespace Signal.Beacon.Application.Mqtt;

internal class MqttClientFactory : IMqttClientFactory
{
    private readonly IServiceProvider serviceProvider;

    public MqttClientFactory(
        IServiceProvider serviceProvider)
    {
        this.serviceProvider = serviceProvider ?? throw new ArgumentNullException(nameof(serviceProvider));
    }

    public IMqttClient Create() => this.serviceProvider.GetRequiredService<IMqttClient>();
}