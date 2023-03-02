using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace Signal.Beacon.Application.PubSub;

public class PubSubHub<TData> : PubSubHubBase<TData, PubSubHub<TData>.Handler>, IPubSubHub<TData>
{
    public PubSubHub(ILogger<PubSubHubBase<TData, Handler>> logger) : base(logger)
    {
    }

    private Handler CreateHandler(object subscriber, Func<IEnumerable<TData>, CancellationToken, Task> handler) =>
        new(this, subscriber, handler);

    public IDisposable Subscribe(Func<IEnumerable<TData>, CancellationToken, Task> handler) =>
        this.Subscribe(this, handler);

    public IDisposable Subscribe(object subscriber, Func<IEnumerable<TData>, CancellationToken, Task> handler) =>
        this.SubscribeInternal(this.CreateHandler(subscriber, handler));

    public virtual async Task PublishAsync(
        IEnumerable<TData> data,
        CancellationToken cancellationToken)
    {
        IEnumerable<Task> listenersExecutionTasks;
        lock (this.ListenersLock)
        {
            listenersExecutionTasks = this.Listeners
                .Select(l => l.Func(data, cancellationToken))
                .ToList();
        }

        await this.WaitAllListeners(listenersExecutionTasks);
    }

    public class Handler : HandlerBase
    {
        public Handler(
            PubSubHubBase<TData, Handler> owner,
            object subscriber,
            Func<IEnumerable<TData>, CancellationToken, Task> func) : base(owner, subscriber, func)
        {
        }
    }
}