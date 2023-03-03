using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Signal.Beacon.Core.Conducts;

namespace Signal.Beacon.Application.Conducts;

internal class ConductSubscriberClient : IConductSubscriberClient
{
    private readonly IConductManager conductManager;


    public ConductSubscriberClient(IConductManager conductManager)
    {
        this.conductManager = conductManager ?? throw new ArgumentNullException(nameof(conductManager));
    }


    public void Subscribe(string channel, Func<IEnumerable<IConduct>, CancellationToken, Task> handler)
    {
        this.conductManager.Subscribe(channel, handler);
    }
}