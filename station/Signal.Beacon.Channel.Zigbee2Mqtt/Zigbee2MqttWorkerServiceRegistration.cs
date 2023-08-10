using System;
using Signal.Beacon.Core.Workers;

namespace Signal.Beacon.Channel.Zigbee2Mqtt;

internal sealed class Zigbee2MqttWorkerServiceRegistration : IWorkerServiceRegistration
{
    public string ChannelName => Zigbee2MqttChannels.DeviceChannel;

    public Type WorkerServiceType => typeof(Zigbee2MqttWorkerService);
}