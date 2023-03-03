using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Signal.Beacon.Core.Structures.Queues;

public class DelayedQueue<T> : IDelayedQueue<T>
{
    private readonly AsyncBlockingQueue queue = new();

    public IAsyncEnumerator<T> GetAsyncEnumerator(CancellationToken cancellationToken = new()) =>
        this.queue.GetAsyncEnumerator(cancellationToken);

    public void Enqueue(T item, TimeSpan due) => this.queue.Enqueue(item, due);
        
    private class AsyncBlockingQueue : IAsyncEnumerable<T>
    {
        private readonly AsyncBlockingQueueEnumerator enumerator = new();

        public void Enqueue(T item, TimeSpan due) => this.enumerator.Enqueue(item, due);

        public IAsyncEnumerator<T> GetAsyncEnumerator(CancellationToken cancellationToken = new()) =>
            this.enumerator;
    }

    private class AsyncBlockingQueueEnumerator : IAsyncEnumerator<T>
    {
        private readonly SortedList<DateTime, T?> queue = new();

        private TaskCompletionSource nextItemDelayTask = new();
        private readonly object queueLock = new();
            
        public void Enqueue(T item, TimeSpan due)
        {
            lock (this.queueLock)
            {
                this.queue.Add(DateTime.UtcNow + due, item);
            }
        }
            
        public ValueTask DisposeAsync()
        {
            if (!this.nextItemDelayTask.Task.IsCompleted)
                this.nextItemDelayTask.SetCanceled();

            return ValueTask.CompletedTask;
        }

        public async ValueTask<bool> MoveNextAsync()
        {
            this.nextItemDelayTask = new TaskCompletionSource();

            _ = Task.Run(() =>
            {
                while (!this.nextItemDelayTask.Task.IsCanceled)
                {
                    lock (this.queueLock)
                    {
                        var (timeStamp, value) = this.queue.FirstOrDefault();
                        if (timeStamp == default || timeStamp > DateTime.UtcNow)
                        {
                            Thread.Sleep(10);
                            continue;
                        }

                        this.queue.RemoveAt(0);
                        this.Current = value;
                    }

                    this.nextItemDelayTask.SetResult();
                    break;
                }
            });

            await this.nextItemDelayTask.Task;
            return true;
        }

        public T? Current { get; private set; }
    }
}