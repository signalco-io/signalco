namespace Signal.Beacon.Core.Mqtt;

public interface IMqttClientFactory
{
    IMqttClient Create();
}