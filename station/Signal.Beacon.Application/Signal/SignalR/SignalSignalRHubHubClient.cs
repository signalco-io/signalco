using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR.Client;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Signal.Beacon.Application.Signal.Client;

namespace Signal.Beacon.Application.Signal.SignalR;

internal abstract class SignalSignalRHubHubClient
{
    protected CancellationToken? StartCancellationToken;

    private readonly ISignalcoClientAuthFlow signalcoClientAuthFlow;
    private readonly ILogger<SignalSignalRHubHubClient> logger;
    private HubConnection? connection;
    private readonly object startLock = new();
    private bool isStarted;
    private readonly Dictionary<string, (Type argType, Func<object[], Task> action)> actions = new();

    protected SignalSignalRHubHubClient(
        ISignalcoClientAuthFlow signalcoClientAuthFlow,
        ILogger<SignalSignalRHubHubClient> logger)
    {
        this.signalcoClientAuthFlow = signalcoClientAuthFlow ?? throw new ArgumentNullException(nameof(signalcoClientAuthFlow));
        this.logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    protected void On<T>(string targetName, Func<T, Task> arg, CancellationToken cancellationToken)
    {
        // Check if we already started the connection, if not don't assign immediately
        if (this.isStarted && 
            this.connection is {State: HubConnectionState.Connected})
        {
            this.logger.LogDebug("Hub assigned immediate action {ActionName}", targetName);
            this.connection.On(targetName, arg);
        }

        this.actions.TryAdd(targetName, (typeof(T), objects => arg((T)objects[0])));
        this.logger.LogDebug("Hub assigned on-start action {ActionName}", targetName);
    }

    public abstract Task StartAsync(CancellationToken cancellationToken);

    protected async Task StartAsync(string hubName, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(hubName))
            throw new ArgumentException("Value cannot be null or whitespace.", nameof(hubName));

        // Already started check
        if (this.isStarted) 
            return;

        // Locked start flag
        lock (this.startLock)
        {
            if (this.isStarted) 
                return;

            this.isStarted = true;
        }

        this.StartCancellationToken = cancellationToken;

        try
        {
            this.connection = new HubConnectionBuilder()
                .AddJsonProtocol()
                .WithUrl($"https://api.signalco.io/api/signalr/{hubName}", options =>
                {
                    options.AccessTokenProvider = async () =>
                    {
                        var retryCount = 0;
                        while (!this.StartCancellationToken.Value.IsCancellationRequested)
                        {
                            if (await this.signalcoClientAuthFlow.GetTokenAsync(this.StartCancellationToken.Value) !=
                                null)
                                break;

                            // Abort after some time
                            if (retryCount > 1000) 
                                return null;

                            // Incremental Delay 
                            var delay = ++retryCount * 1000;
                            this.logger.LogWarning("SignalR token failed to retrieve... delayed retry in {DelayMs}ms", delay);
                            await Task.Delay(delay, this.StartCancellationToken.Value);
                        }

                        var tokenResult = await this.signalcoClientAuthFlow.GetTokenAsync(this.StartCancellationToken.Value);
                        return tokenResult?.AccessToken;
                    };
                })
                .WithAutomaticReconnect()
                .Build();

            this.connection.Reconnecting += error => {
                this.logger.LogInformation(error, "{HubName} hub connection - reconnecting...", hubName);
                return Task.CompletedTask;
            };

            this.connection.Reconnected += _ => {
                this.logger.LogInformation("{HubName} hub connection reconnected", hubName);
                return Task.CompletedTask;
            };

            this.connection.Closed += async error => {
                this.logger.LogInformation(error, "{HubName} hub connection closed", hubName);
                await this.ReconnectDelayedAsync(hubName, cancellationToken);
            };

            // Start the connection
            await this.connection.StartAsync(this.StartCancellationToken.Value);

            this.logger.LogInformation("{HubName} hub started", hubName);

            // Reassign actions
            foreach (var (actionName, actionFunc) in this.actions)
            {
                this.connection.On(actionName, new[]{actionFunc.argType}, actionFunc.action);
                this.logger.LogDebug("{HubName} re-assigned action {ActionName}", hubName, actionName);
            }
        }
        catch (Exception ex)
        {
            this.logger.LogTrace(ex, "Failed to start SignalR connection for hub {HubName}", hubName);
            this.logger.LogWarning("Failed to start Signal SignalR {HubName} hub", hubName);

            await this.ReconnectDelayedAsync(hubName, cancellationToken);
        }
    }

    private async Task ReconnectDelayedAsync(string hubName, CancellationToken cancellationToken)
    {
        this.isStarted = false;

        try
        {
            if (this.connection != null)
                await this.connection.DisposeAsync();
        }
        catch (Exception ex)
        {
            this.logger.LogTrace(ex, "Failed to dispose SignalR connection");
            this.logger.LogDebug("Failed to dispose SignalR connection");
        }

        await Task.Delay(TimeSpan.FromSeconds(10), cancellationToken);
        _ = this.StartAsync(hubName, cancellationToken);
    }
}