using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Signal.Beacon.Application.Signal.SignalR;

public interface ISignalSignalRConductsHubClient : ISignalSignalRHubClient
{
    void OnConductRequest(Func<ConductRequestDto, CancellationToken, Task> handler, CancellationToken cancellationToken);

    void OnConductRequestMultiple(
        Func<IEnumerable<ConductRequestDto>, CancellationToken, Task> handler,
        CancellationToken cancellationToken);
}