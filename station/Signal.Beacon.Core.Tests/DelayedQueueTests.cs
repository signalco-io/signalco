using System;
using System.Diagnostics;
using System.Threading.Tasks;
using Signal.Beacon.Core.Structures.Queues;
using Xunit;

namespace Signal.Beacon.Core.Tests
{
    public class DelayedQueueTests
    {
        [Fact]
        public async Task DelayedQueue_InTime30ms()
        {
            var queue = new DelayedQueue<string>();

            queue.Enqueue("test", TimeSpan.FromMilliseconds(100));

            var sw = Stopwatch.StartNew();
            await foreach (var _ in queue)
                break;
            sw.Stop();

            Assert.InRange(sw.Elapsed, TimeSpan.FromMilliseconds(100), TimeSpan.FromMilliseconds(130));
        }

        [Fact]
        public async Task DelayedQueue_TooLong()
        {
            var queue = new DelayedQueue<string>();
            
            queue.Enqueue("test", TimeSpan.FromMilliseconds(160));

            var sw = Stopwatch.StartNew();
            await foreach (var _ in queue)
                break;
            sw.Stop();

            Assert.NotInRange(sw.Elapsed, TimeSpan.FromMilliseconds(100), TimeSpan.FromMilliseconds(130));
        }

        [Fact]
        public async Task DelayedQueue_EmptyQueue()
        {
            var queue = new DelayedQueue<string>();
            
            var task = Task.Run(async () =>
            {
                await foreach (var item in queue)
                    throw new Exception("Shouldn't trigger");
            });

            await Task.WhenAny(
                Task.Delay(500),
                task);

            Assert.False(task.IsCompleted);
        }

        [Fact]
        public async Task DelayedQueue_NotEmpty()
        {
            var queue = new DelayedQueue<string>();

            _ = Task.Run(() => queue.Enqueue("test", TimeSpan.FromMilliseconds(100)));

            var task = Task.Run(async () =>
            {
                await foreach (var item in queue)
                    throw new Exception("Shouldn't trigger");
            });

            await Task.WhenAny(
                Task.Delay(500),
                task);

            Assert.True(task.IsCompleted);
        }

        [Fact]
        public async Task DelayedQueue_Ordering()
        {
            var queue = new DelayedQueue<string>();
            
            queue.Enqueue("test1", TimeSpan.FromMilliseconds(101));
            queue.Enqueue("test2", TimeSpan.FromMilliseconds(100));

            await foreach (var item in queue)
            {
                Assert.Equal("test2", item);
                break;
            }
        }

        [Fact]
        public async Task DelayedQueue_OrderingNearZero()
        {
            var queue = new DelayedQueue<string>();

            await Task.WhenAll(
                Task.Run(async () =>
                {
                    await foreach (var item in queue)
                    {
                        Assert.Equal("test2", item);
                        break;
                    }
                }),
                Task.Run(async () =>
                {
                    await Task.Delay(TimeSpan.FromMilliseconds(100));
                    queue.Enqueue("test1", TimeSpan.FromMilliseconds(100));
                    queue.Enqueue("test2", TimeSpan.FromMilliseconds(0));
                }));
        }
    }
}
