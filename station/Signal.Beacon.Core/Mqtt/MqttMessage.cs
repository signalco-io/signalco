namespace Signal.Beacon.Core.Mqtt;

public record MqttMessage(IMqttClient Client, string Topic, string Payload, byte[] PayloadRaw);