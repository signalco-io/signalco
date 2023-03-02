using System;
using System.Collections.Generic;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Signal.Beacon.Application.Signal.Client;

namespace Signal.Beacon.Application.Signal.SignalR;

internal class SignalSignalRConductsHubClient : SignalSignalRHubHubClient, ISignalSignalRConductsHubClient
{
    private readonly ILogger<SignalSignalRConductsHubClient> logger;

    public SignalSignalRConductsHubClient(
        ISignalcoClientAuthFlow signalcoClientAuthFlow, 
        ILogger<SignalSignalRHubHubClient> logger,
        ILogger<SignalSignalRConductsHubClient> conductsLogger) : 
        base(signalcoClientAuthFlow, logger)
    {
        this.logger = conductsLogger ?? throw new ArgumentNullException(nameof(conductsLogger));
    }

    public override Task StartAsync(CancellationToken cancellationToken) => 
        this.StartAsync("conducts", cancellationToken);

    public void OnConductRequestMultiple(Func<IEnumerable<ConductRequestDto>, CancellationToken, Task> handler, CancellationToken cancellationToken)
    {
        this.On<string>("requested-multiple", async payload =>
        {
            var requests = JsonSerializer.Deserialize<List<ConductRequestDto>>(payload);
            if (requests == null)
            {
                this.logger.LogDebug("Got empty conduct request from SignalR. Payload: {Payload}", payload);
                return;
            }

            foreach (var request in requests)
                this.logger.LogInformation(
                    "Conduct requested (multiple): {EntityId} {ChannelName} {ContactName} {ValueSerialized} {Delay}",
                    request.EntityId,
                    request.ChannelName,
                    request.ContactName,
                    request.ValueSerialized,
                    request.Delay);

            if (this.StartCancellationToken == null ||
                this.StartCancellationToken.Value.IsCancellationRequested)
                return;

            await handler(requests, this.StartCancellationToken.Value);
        }, cancellationToken);
    }

    public void OnConductRequest(Func<ConductRequestDto, CancellationToken, Task> handler, CancellationToken cancellationToken)
    {
        this.On<string>("requested", async payload =>
        {
            var request = JsonSerializer.Deserialize<ConductRequestDto>(payload);
            if (request == null)
            {
                this.logger.LogDebug("Got empty conduct request from SignalR. Payload: {Payload}", payload);
                return;
            }

            this.logger.LogInformation("Conduct requested: {EntityId} {ChannelName} {ContactName} {ValueSerialized} {Delay}",
                request.EntityId,
                request.ChannelName,
                request.ContactName,
                request.ValueSerialized,
                request.Delay);

            if (this.StartCancellationToken == null ||
                this.StartCancellationToken.Value.IsCancellationRequested)
                return;

            await handler(request, this.StartCancellationToken.Value);
        }, cancellationToken);
    }
}