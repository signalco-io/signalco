using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Sockets;
using System.Security.Authentication;
using System.Text;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using MQTTnet;
using MQTTnet.Client;
using MQTTnet.Extensions.ManagedClient;
using Signal.Beacon.Core.Mqtt;
using IMqttClient = Signal.Beacon.Core.Mqtt.IMqttClient;

namespace Signal.Beacon.Application.Mqtt;

public class MqttClient : IMqttClient
{
    private readonly ILogger<MqttClient> logger;
    private IManagedMqttClient? mqttClient;

    private string? assignedClientName;

    private readonly Dictionary<string, List<Func<MqttMessage, Task>>> subscriptions = new();

    public event EventHandler<MqttMessage>? OnMessage;

    private bool isDisconnected;
    public event EventHandler? OnUnavailable;


    public MqttClient(ILogger<MqttClient> logger)
    {
        this.logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }


    public async Task StartAsync(
        string clientName, string hostAddress, CancellationToken cancellationToken, 
        int? port = null,
        string? username = null, string? password = null,
        bool allowInsecure = false)
    {
        if (string.IsNullOrWhiteSpace(clientName))
            throw new ArgumentException("Value cannot be null or whitespace.", nameof(clientName));
        if (string.IsNullOrWhiteSpace(hostAddress))
            throw new ArgumentException("Value cannot be null or whitespace.", nameof(hostAddress));
        if (this.mqttClient != null)
            throw new Exception("Can't start client twice.");

        this.assignedClientName = clientName;

        try
        {
            var addresses = await Dns.GetHostAddressesAsync(hostAddress, cancellationToken);
            var selectedAddress = addresses.FirstOrDefault();
            if (selectedAddress == null)
                throw new Exception("Invalid host address - none.");

            var optionsBuilder = new MqttClientOptionsBuilder()
                .WithClientId(clientName)
                .WithTcpServer(selectedAddress.ToString(), port);

            if (allowInsecure)
                optionsBuilder = optionsBuilder.WithTls(new MqttClientOptionsBuilderTlsParameters
                {
                    AllowUntrustedCertificates = true,
                    UseTls = true,
                    IgnoreCertificateRevocationErrors = true,
                    CertificateValidationHandler = _ => true,
                    IgnoreCertificateChainErrors = true,
                    SslProtocol = SslProtocols.Tls12
                });

            if (!string.IsNullOrWhiteSpace(username) || !string.IsNullOrWhiteSpace(password))
                optionsBuilder = optionsBuilder.WithCredentials(username, password);

            var options = new ManagedMqttClientOptionsBuilder()
                .WithAutoReconnectDelay(TimeSpan.FromSeconds(5))
                .WithClientOptions(optionsBuilder.Build())
                .Build();

            this.mqttClient = new MqttFactory().CreateManagedMqttClient();
            this.mqttClient.ApplicationMessageReceivedAsync += this.MessageHandler;
            this.mqttClient.ConnectedAsync += this.ConnectedHandler;
            this.mqttClient.DisconnectedAsync += this.DisconnectedHandler;
            await this.mqttClient.StartAsync(options);
        }
        catch (SocketException ex) when (ex.SocketErrorCode == SocketError.HostNotFound)
        {
            this.logger.LogError("Unable to resolve MQTT host {ClientName}: {HostAddress}", this.assignedClientName, hostAddress);
            throw;
        }
        catch (Exception ex)
        {
            this.logger.LogError(ex, "Failed to start MQTT client {ClientName}.", this.assignedClientName);
            throw;
        }
    }

    public async Task StopAsync(CancellationToken cancellationToken)
    {
        this.isDisconnected = true;
        if (this.mqttClient != null)
            await this.mqttClient.StopAsync();
    }

    public async Task SubscribeAsync(string topic, Func<MqttMessage, Task> handler)
    {
        await this.mqttClient.SubscribeAsync(topic);

        if (!this.subscriptions.ContainsKey(topic))
        {
            this.subscriptions.Add(topic, new List<Func<MqttMessage, Task>>());
            this.logger.LogDebug("{ClientName} Subscribed to topic: {Topic}", this.assignedClientName, topic);
        }

        this.subscriptions[topic].Add(handler);
    }

    public async Task PublishAsync(string topic, object? payload, bool retain = false)
    {
        var withPayload = payload switch
        {
            null => null,
            byte[] payloadByteArray => payloadByteArray,
            string payloadString => Encoding.UTF8.GetBytes(payloadString),
            _ => Encoding.UTF8.GetBytes(JsonSerializer.Serialize(payload, payload.GetType()))
        };

        var message = new MqttApplicationMessageBuilder()
            .WithTopic(topic)
            .WithPayload(withPayload)
            .WithRetainFlag(retain)
            .Build();
        await this.mqttClient.EnqueueAsync(message);
    }

    private async Task MessageHandler(MqttApplicationMessageReceivedEventArgs arg)
    {
        var message = new MqttMessage(
            this, 
            arg.ApplicationMessage.Topic, 
            Encoding.UTF8.GetString(arg.ApplicationMessage.Payload), 
            arg.ApplicationMessage.Payload);

        this.logger.LogTrace("{ClientName} Topic {Topic}, Payload: {Payload}", this.assignedClientName, message.Topic, message.Payload);

        this.OnMessage?.Invoke(this, message);

        foreach (var subscription in this.subscriptions
            .Where(subscription => MqttTopicFilterComparer.Compare(arg.ApplicationMessage.Topic, subscription.Key) == MqttTopicFilterCompareResult.IsMatch)
            .SelectMany(s => s.Value))
        {
            try
            {
                await subscription(message);
            }
            catch (Exception ex)
            {
                this.logger.LogWarning(ex, "{ClientName} Queue subscriber threw exception while processing message.", this.assignedClientName);
            }
        }
    }

    private Task DisconnectedHandler(EventArgs arg)
    {
        if (!this.isDisconnected)
        {
            this.isDisconnected = true;
            this.OnUnavailable?.Invoke(this, EventArgs.Empty);
        }

        return Task.CompletedTask;
    }

    private Task ConnectedHandler(EventArgs arg)
    {
        this.isDisconnected = false;
        this.logger.LogInformation("MQTT connected {ClientName}.", this.assignedClientName);
        return Task.CompletedTask;
    }
        
    public void Dispose()
    {
        this.mqttClient?.Dispose();
    }
}