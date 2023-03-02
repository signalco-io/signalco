using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Signal.Beacon.Core.Conducts;

namespace Signal.Beacon.Application.Conducts;

internal interface IConductManager
{
    Task StartAsync(CancellationToken cancellationToken);

    IDisposable Subscribe(string channel, Func<IEnumerable<IConduct>, CancellationToken, Task> handler);

    Task PublishAsync(IEnumerable<IConduct> conducts, CancellationToken cancellationToken);
}