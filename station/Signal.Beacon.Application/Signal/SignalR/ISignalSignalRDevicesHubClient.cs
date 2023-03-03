using Signal.Beacon.Application.Signal.Client.Contact;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Signal.Beacon.Application.Signal.SignalR;

internal interface ISignalSignalRDevicesHubClient : ISignalSignalRHubClient
{
    void OnDeviceState(Func<SignalcoContactUpsertDto, CancellationToken, Task> handler, CancellationToken cancellationToken);
}