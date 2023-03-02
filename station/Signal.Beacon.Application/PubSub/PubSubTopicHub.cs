using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace Signal.Beacon.Application.PubSub;

public class PubSubTopicHub<TData> : PubSubHubBase<TData, PubSubTopicHub<TData>.TopicHandler>, IPubSubTopicHub<TData>
{
    public PubSubTopicHub(ILogger<PubSubHubBase<TData, TopicHandler>> logger) : base(logger)
    {
    }

    private TopicHandler CreateHandler(object subscriber, IEnumerable<string> filters,
        Func<IEnumerable<TData>, CancellationToken, Task> handler) =>
        new(this, subscriber, filters, handler);

    public IDisposable Subscribe(IEnumerable<string> filters, Func<IEnumerable<TData>, CancellationToken, Task> handler) =>
        this.Subscribe(this, filters, handler);

    public IDisposable Subscribe(object subscriber, IEnumerable<string> filters,
        Func<IEnumerable<TData>, CancellationToken, Task> handler) =>
        this.SubscribeInternal(this.CreateHandler(subscriber, filters, handler));

    public virtual async Task PublishAsync(
        string topic,
        IEnumerable<TData> data,
        CancellationToken cancellationToken)
    {
        IEnumerable<Task> listenersExecutionTasks;
        lock (this.ListenersLock)
        {
            listenersExecutionTasks = this.Listeners
                .Where(l => l.Filters.Contains(topic))
                .Select(l => l.Func(data, cancellationToken))
                .ToList();
        }

        await this.WaitAllListeners(listenersExecutionTasks);
    }

    public class TopicHandler : HandlerBase
    {
        public IEnumerable<string> Filters { get; }

        public TopicHandler(
            PubSubHubBase<TData, TopicHandler> owner, 
            object subscriber, 
            IEnumerable<string> filters,
            Func<IEnumerable<TData>, CancellationToken, Task> func) : base(owner, subscriber, func)
        {
            this.Filters = filters.ToList();
        }
    }
}