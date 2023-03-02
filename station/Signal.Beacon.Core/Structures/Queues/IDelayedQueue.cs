using System;
using System.Collections.Generic;

namespace Signal.Beacon.Core.Structures.Queues;

public interface IDelayedQueue<T> : IAsyncEnumerable<T>
{
    void Enqueue(T item, TimeSpan due);
}