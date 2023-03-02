using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Signal.Beacon.Application.Signal.Client;
using Signal.Beacon.Application.Signal.Client.Contact;

namespace Signal.Beacon.Application.Signal.SignalR;

internal class SignalSignalRDevicesHubClient : SignalSignalRHubHubClient, ISignalSignalRDevicesHubClient
{
    public SignalSignalRDevicesHubClient(
        ISignalcoClientAuthFlow signalcoClientAuthFlow, 
        ILogger<SignalSignalRHubHubClient> logger) : 
        base(signalcoClientAuthFlow, logger)
    {
    }

    public override Task StartAsync(CancellationToken cancellationToken) => 
        this.StartAsync("contacts", cancellationToken);

    public void OnDeviceState(Func<SignalcoContactUpsertDto, CancellationToken, Task> handler, CancellationToken cancellationToken) => 
        this.On<SignalcoContactUpsertDto>("contact", async state => await handler(state, cancellationToken), cancellationToken);
}