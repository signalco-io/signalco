using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Signal.Beacon.Application.PubSub;

public interface IPubSubTopicHub<TData>
{
    IDisposable Subscribe(
        IEnumerable<string> filters, 
        Func<IEnumerable<TData>, CancellationToken, Task> handler);

    IDisposable Subscribe(
        object subscriber, 
        IEnumerable<string> filters,
        Func<IEnumerable<TData>, CancellationToken, Task> handler);

    Task PublishAsync(
        string topic,
        IEnumerable<TData> data,
        CancellationToken cancellationToken);
}