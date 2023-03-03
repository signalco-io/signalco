using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace Signal.Beacon.Application.PubSub;

public abstract class PubSubHubBase<TData, THandler> where THandler : PubSubHubBase<TData, THandler>.HandlerBase
{
    private readonly ILogger<PubSubHubBase<TData, THandler>> logger;
    protected readonly object ListenersLock = new();
    protected readonly List<THandler> Listeners = new();


    protected PubSubHubBase(ILogger<PubSubHubBase<TData, THandler>> logger)
    {
        this.logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }


    protected IDisposable SubscribeInternal(THandler handler)
    {
        lock (this.ListenersLock)
        {
            this.Listeners.Add(handler);
            return handler;
        }
    }

    private void UnsubscribeInternal(IDisposable handlerRef)
    {
        if (handlerRef is not THandler handler)
            return;

        lock (this.ListenersLock)
        {
            if (this.Listeners.Contains(handler))
                this.Listeners.Remove(handler);
        }
    }

    protected async Task WaitAllListeners(IEnumerable<Task> executionTasks)
    {
        try
        {
            await Task.WhenAll(executionTasks);
        }
        catch (Exception ex)
        {
            this.logger.LogWarning(ex, "One or more conducts failed to execute.");
            throw;
        }
    }

    public class HandlerBase : IDisposable
    {
        private WeakReference<PubSubHubBase<TData, THandler>> Owner { get; }

        private WeakReference Subscriber { get; }

        public Func<IEnumerable<TData>, CancellationToken, Task> Func { get; }

        protected HandlerBase(PubSubHubBase<TData, THandler> owner, object subscriber,
            Func<IEnumerable<TData>, CancellationToken, Task> func)
        {
            this.Owner = new WeakReference<PubSubHubBase<TData, THandler>>(owner);
            this.Subscriber = new WeakReference(subscriber);
            this.Func = func;
        }

        public void Dispose()
        {
            if (this.Owner.TryGetTarget(out var hub))
                hub.UnsubscribeInternal(this);
        }
    }
}