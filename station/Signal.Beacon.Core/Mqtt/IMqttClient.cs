using System;
using System.Threading;
using System.Threading.Tasks;

namespace Signal.Beacon.Core.Mqtt;

public interface IMqttClient : IDisposable
{
    Task StartAsync(string clientName, string hostAddress, CancellationToken cancellationToken,
        int? port = null,
        string? username = null, string? password = null,
        bool allowInsecure = false);
        
    Task StopAsync(CancellationToken cancellationToken);

    Task SubscribeAsync(string topic, Func<MqttMessage, Task> handler);

    Task PublishAsync(string topic, object? payload, bool retain = false);

    event EventHandler? OnUnavailable;

    event EventHandler<MqttMessage>? OnMessage;
}