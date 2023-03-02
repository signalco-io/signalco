using System;
using System.Collections.Generic;

namespace Signal.Beacon.Core.Structures.Queues;

public static class DelayedQueueExtensions
{
    public static void Enqueue<T>(this IDelayedQueue<T> queue, IEnumerable<T> items, Func<T, TimeSpan> delayFunc)
    {
        foreach (var item in items) 
            queue.Enqueue(item, delayFunc(item));
    }

    public static void Enqueue<T>(this IDelayedQueue<T> queue, T item, DateTime timeStamp) =>
        queue.Enqueue(item, timeStamp - DateTime.UtcNow);
}