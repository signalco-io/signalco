using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Signal.Beacon.Application.PubSub;

public interface IPubSubHub<TData>
{
    IDisposable Subscribe(Func<IEnumerable<TData>, CancellationToken, Task> handler);

    IDisposable Subscribe(
        object subscriber, 
        Func<IEnumerable<TData>, CancellationToken, Task> handler);

    Task PublishAsync(
        IEnumerable<TData> data,
        CancellationToken cancellationToken);
}