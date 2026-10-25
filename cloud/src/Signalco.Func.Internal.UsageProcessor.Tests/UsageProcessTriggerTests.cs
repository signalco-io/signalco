using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Azure;
using Azure.Storage.Queues;
using Azure.Storage.Queues.Models;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging.Abstractions;
using Moq;
using Signal.Core;
using Signal.Core.Contacts;
using Signal.Core.Entities;
using Signal.Core.Notifications;
using Signal.Core.Processor;
using Signal.Core.Sharing;
using Signal.Core.Storage;
using Signal.Core.Usage;
using Signal.Infrastructure.AzureStorage.Tables;
using Xunit;

namespace Signalco.Func.Internal.UsageProcessor.Tests;

public class UsageProcessTriggerTests
{
    [Fact]
    public async Task EmptyQueueDoesNotReadOrWriteEntities()
    {
        var fixture = new Fixture();

        await fixture.RunAsync();

        fixture.Entities.VerifyNoOtherCalls();
        fixture.Queue.Verify(q => q.ReceiveMessagesAsync(32, TimeSpan.FromMinutes(10), default), Times.Once);
        Assert.Empty(fixture.Deleted);
    }

    [Fact]
    public async Task AggregatesKindsPerUserAndAcknowledgesAfterPersisting()
    {
        var fixture = new Fixture();
        fixture.Usage["first"] = new Usage(10, 20, 30, 40);
        var messages = new[] {
            Message("first", UsageKind.ContactSet),
            Message("second", UsageKind.Process),
            Message("first", UsageKind.ContactSet),
            Message("first", UsageKind.Conduct),
            Message("first", UsageKind.Process),
            Message("first", UsageKind.Other),
            Message("first", (UsageKind)999)};
        fixture.Enqueue(messages);
        fixture.Queue.Setup(q => q.DeleteMessageAsync(It.IsAny<string>(), It.IsAny<string>(), default))
            .Callback<string, string, CancellationToken>((id, _, _) =>
            {
                var message = messages.Single(m => m.MessageId == id);
                var item = JsonSerializer.Deserialize<UsageQueueItem>(Convert.FromBase64String(message.Body.ToString()))!;
                Assert.Contains(fixture.Writes, p => p.EntityId == item.UserId);
            })
            .ReturnsAsync(Mock.Of<Response>());

        await fixture.RunAsync();

        Assert.Equal(new Usage(12, 22, 31, 41), fixture.Usage["first"]);
        Assert.Equal(new Usage(0, 0, 0, 1), fixture.Usage["second"]);
        Assert.Equal(2, fixture.Writes.Count);
        Assert.All(fixture.Writes, p =>
        {
            Assert.Equal("signalco", p.ChannelName);
            Assert.StartsWith("usage-", p.ContactName);
            Assert.Equal(14, p.ContactName.Length);
        });
        fixture.Queue.Verify(q => q.DeleteMessageAsync(It.IsAny<string>(), It.IsAny<string>(), default), Times.Exactly(7));
        fixture.Entities.Verify(e => e.ContactAsync(It.IsAny<IContactPointer>(), default), Times.Exactly(2));
    }

    [Fact]
    public async Task DrainsMultipleBatchesIncludingPartialBatches()
    {
        var fixture = new Fixture();
        fixture.Enqueue(Enumerable.Range(0, 32).Select(_ => Message("user", UsageKind.Conduct)).ToArray());
        fixture.Enqueue(Message("user", UsageKind.Conduct));
        fixture.Enqueue(Message("user", UsageKind.Process));

        await fixture.RunAsync();

        Assert.Equal(new Usage(0, 0, 33, 1), fixture.Usage["user"]);
        Assert.Equal(34, fixture.Deleted.Count);
        fixture.Queue.Verify(q => q.ReceiveMessagesAsync(32, TimeSpan.FromMinutes(10), default), Times.Exactly(4));
    }

    [Fact]
    public async Task CreatesMissingUserEntityOnceForTheBatch()
    {
        var fixture = new Fixture();
        fixture.Enqueue(Message("user", UsageKind.Conduct), Message("user", UsageKind.Conduct));
        fixture.Entities.Setup(e => e.AllAsync("user", It.IsAny<IEnumerable<EntityType>>(), default))
            .ReturnsAsync(Array.Empty<IEntity>());
        fixture.Entities.Setup(e => e.UpsertAsync("user", null, It.IsAny<Func<string, IEntity>>(), default))
            .ReturnsAsync("new-entity");
        fixture.Entities.Setup(e => e.GetInternalAsync("new-entity", default))
            .ReturnsAsync(new Entity(EntityType.User, "new-entity", "Me"));

        await fixture.RunAsync();

        Assert.Equal(new Usage(0, 0, 2, 0), fixture.Usage["new-entity"]);
        fixture.Entities.Verify(e => e.UpsertAsync("user", null, It.IsAny<Func<string, IEntity>>(), default), Times.Once);
        Assert.Equal(2, fixture.Deleted.Count);
    }

    [Fact]
    public async Task FailedUserRemainsQueuedWhileOtherUsersAreProcessed()
    {
        var fixture = new Fixture();
        var failed = Message("failed", UsageKind.Conduct);
        var good = Message("good", UsageKind.Conduct);
        fixture.Enqueue(failed, good);
        fixture.FailWrites("failed", new InvalidOperationException("Storage unavailable"));

        await fixture.RunAsync();

        Assert.Equal(new[] {good.MessageId}, fixture.Deleted);
        Assert.Equal(new Usage(0, 0, 1, 0), fixture.Usage["good"]);
        fixture.Factory.Verify(f => f.GetQueueClientAsync("usage-processing-poison", default), Times.Never);
    }

    [Theory]
    [InlineData(4, false)]
    [InlineData(5, true)]
    public async Task FailedWritesMoveToPoisonOnlyAfterFiveAttempts(int dequeueCount, bool poisoned)
    {
        var fixture = new Fixture();
        var message = Message("user", UsageKind.Conduct, dequeueCount);
        fixture.Enqueue(message);
        fixture.FailWrites("user", new InvalidOperationException("Storage unavailable"));

        await fixture.RunAsync();

        Assert.Equal(poisoned ? new[] {message.MessageId} : Array.Empty<string>(), fixture.Deleted);
        Assert.Equal(poisoned ? new[] {message.Body.ToString()} : Array.Empty<string>(), fixture.Poisoned);
    }

    [Theory]
    [InlineData("invalid base64", false)]
    [InlineData("invalid json", true)]
    [InlineData("null", true)]
    [InlineData("{}", true)]
    [InlineData("{\"UserId\":\" \"}", true)]
    public async Task MalformedMessagesArePoisonedWithoutBlockingValidMessages(string payload, bool encode)
    {
        var fixture = new Fixture();
        var invalid = RawMessage(encode ? Encode(payload) : payload, 5);
        var good = Message("good", UsageKind.Conduct);
        fixture.Enqueue(invalid, good);

        await fixture.RunAsync();

        Assert.Equal(new[] {invalid.Body.ToString()}, fixture.Poisoned);
        Assert.Equal(new[] {invalid.MessageId, good.MessageId}, fixture.Deleted);
        Assert.Equal(new Usage(0, 0, 1, 0), fixture.Usage["good"]);
    }

    [Fact]
    public async Task PoisonQueueFailureDoesNotAcknowledgeOriginalMessage()
    {
        var fixture = new Fixture();
        fixture.Enqueue(RawMessage("invalid base64", 5));
        fixture.PoisonQueue.Setup(q => q.SendMessageAsync(It.IsAny<BinaryData>(), null, null, default))
            .ThrowsAsync(new InvalidOperationException("Poison queue unavailable"));

        await Assert.ThrowsAsync<InvalidOperationException>(() => fixture.RunAsync());

        Assert.Empty(fixture.Deleted);
    }

    [Fact]
    public async Task AcknowledgementFailureDoesNotPoisonPersistedUsage()
    {
        var fixture = new Fixture();
        fixture.Enqueue(Message("user", UsageKind.Conduct, 5));
        fixture.Queue.Setup(q => q.DeleteMessageAsync(It.IsAny<string>(), It.IsAny<string>(), default))
            .ThrowsAsync(new InvalidOperationException("Queue unavailable"));

        await Assert.ThrowsAsync<InvalidOperationException>(() => fixture.RunAsync());

        Assert.Equal(new Usage(0, 0, 1, 0), fixture.Usage["user"]);
        Assert.Empty(fixture.Poisoned);
    }

    [Fact]
    public async Task CancellationDuringPersistenceLeavesMessagesQueued()
    {
        var fixture = new Fixture();
        fixture.Enqueue(Message("user", UsageKind.Conduct, 5));
        fixture.FailWrites("user", new OperationCanceledException());

        await Assert.ThrowsAsync<OperationCanceledException>(() => fixture.RunAsync());

        Assert.Empty(fixture.Deleted);
        Assert.Empty(fixture.Poisoned);
    }

    [Fact]
    public async Task CancelledInvocationDoesNotReceiveMessages()
    {
        var fixture = new Fixture();
        using var cancellation = new CancellationTokenSource();
        cancellation.Cancel();

        await Assert.ThrowsAsync<OperationCanceledException>(() => fixture.RunAsync(cancellation.Token));

        fixture.Queue.Verify(q => q.ReceiveMessagesAsync(
            It.IsAny<int?>(), It.IsAny<TimeSpan?>(), It.IsAny<CancellationToken>()), Times.Never);
    }

    [Theory]
    [InlineData(false)]
    [InlineData(true)]
    public async Task RealEntityServicePropagatesWriteFailuresToTheProcessor(bool cancelled)
    {
        var fixture = new Fixture();
        fixture.Enqueue(Message("user", UsageKind.Conduct));
        var storage = new Mock<IAzureStorage>(MockBehavior.Strict);
        Exception exception = cancelled ? new OperationCanceledException() : new InvalidOperationException("Storage unavailable");
        storage.Setup(s => s.UpsertAsync(It.IsAny<IContact>(), default)).ThrowsAsync(exception);
        using var services = EntityServices(storage.Object);
        var trigger = new UsageProcessTrigger(services.GetRequiredService<IEntityService>(),
            fixture.Factory.Object, NullLogger<UsageProcessTrigger>.Instance);

        if (cancelled)
            await Assert.ThrowsAsync<OperationCanceledException>(() => trigger.Run(new TimerInfo()));
        else
            await trigger.Run(new TimerInfo());

        storage.Verify(s => s.UpsertAsync(It.IsAny<IContact>(), default), Times.Once);
        Assert.Empty(fixture.Deleted);
        Assert.Empty(fixture.Poisoned);
    }

    [Fact]
    public async Task ContactServiceKeepsExistingErrorHandlingByDefault()
    {
        var storage = new Mock<IAzureStorage>(MockBehavior.Strict);
        storage.Setup(s => s.UpsertAsync(It.IsAny<IContact>(), default))
            .ThrowsAsync(new InvalidOperationException("Storage unavailable"));
        using var services = EntityServices(storage.Object);

        await services.GetRequiredService<IEntityService>().ContactSetAsync(
            new ContactPointer("user", "signalco", "usage-20261024"), "{}",
            doNotProcess: true, doNotNotify: true, doNotCache: true);

        storage.Verify(s => s.UpsertAsync(It.IsAny<IContact>(), default), Times.Once);
    }

    private static ServiceProvider EntityServices(IAzureStorage storage)
    {
        var dao = new Mock<IAzureStorageDao>(MockBehavior.Strict);
        dao.Setup(d => d.UserEntitiesAsync("user", It.IsAny<IEnumerable<EntityType>>(), default))
            .ReturnsAsync(new IEntity[] {new Entity(EntityType.User, "user", "Me")});
        dao.Setup(d => d.ContactAsync(It.IsAny<IContactPointer>(), default)).ReturnsAsync((IContact?)null);
        return new ServiceCollection()
            .AddCore()
            .AddSingleton(storage)
            .AddSingleton(dao.Object)
            .AddSingleton(Mock.Of<ISharingService>())
            .AddSingleton(Mock.Of<IProcessManager>())
            .AddSingleton(Mock.Of<ISignalRService>())
            .BuildServiceProvider();
    }

    private static QueueMessage Message(string userId, UsageKind kind, int dequeueCount = 1) =>
        RawMessage(Encode(JsonSerializer.Serialize(new UsageQueueItem(userId, kind))), dequeueCount);

    private static string Encode(string value) => Convert.ToBase64String(Encoding.UTF8.GetBytes(value));

    private static QueueMessage RawMessage(string body, int dequeueCount) =>
        QueuesModelFactory.QueueMessage(Guid.NewGuid().ToString(), "pop-receipt", BinaryData.FromString(body), dequeueCount);

    private sealed class Fixture
    {
        public Mock<IEntityService> Entities { get; } = new(MockBehavior.Strict);
        public Mock<IAzureStorageClientFactory> Factory { get; } = new(MockBehavior.Strict);
        public Mock<QueueClient> Queue { get; } = new(MockBehavior.Strict);
        public Mock<QueueClient> PoisonQueue { get; } = new(MockBehavior.Strict);
        public Dictionary<string, Usage> Usage { get; } = new();
        public List<IContactPointer> Writes { get; } = new();
        public List<string> Deleted { get; } = new();
        public List<string> Poisoned { get; } = new();
        private readonly Queue<QueueMessage[]> batches = new();

        public Fixture()
        {
            Factory.Setup(f => f.GetQueueClientAsync("usage-processing", It.IsAny<CancellationToken>()))
                .ReturnsAsync(Queue.Object);
            Factory.Setup(f => f.GetQueueClientAsync("usage-processing-poison", It.IsAny<CancellationToken>()))
                .ReturnsAsync(PoisonQueue.Object);
            foreach (var queue in new[] {Queue, PoisonQueue})
                queue.Setup(q => q.CreateIfNotExistsAsync(null, It.IsAny<CancellationToken>()))
                    .ReturnsAsync(Mock.Of<Response>());
            Queue.Setup(q => q.ReceiveMessagesAsync(32, TimeSpan.FromMinutes(10), It.IsAny<CancellationToken>()))
                .ReturnsAsync(() => Response.FromValue(
                    batches.TryDequeue(out var batch) ? batch : Array.Empty<QueueMessage>(), Mock.Of<Response>()));
            Queue.Setup(q => q.DeleteMessageAsync(It.IsAny<string>(), "pop-receipt", It.IsAny<CancellationToken>()))
                .Callback<string, string, CancellationToken>((id, _, _) => Deleted.Add(id))
                .ReturnsAsync(Mock.Of<Response>());
            PoisonQueue.Setup(q => q.SendMessageAsync(It.IsAny<BinaryData>(), null, null, It.IsAny<CancellationToken>()))
                .Callback<BinaryData, TimeSpan?, TimeSpan?, CancellationToken>((body, _, _, _) => Poisoned.Add(body.ToString()))
                .ReturnsAsync(Response.FromValue<SendReceipt>(null!, Mock.Of<Response>()));
            Entities.Setup(e => e.AllAsync(It.IsAny<string>(),
                    It.Is<IEnumerable<EntityType>>(types => types.SequenceEqual(new[] {EntityType.User})),
                    It.IsAny<CancellationToken>()))
                .ReturnsAsync((string userId, IEnumerable<EntityType> _, CancellationToken _) =>
                    new IEntity[] {new Entity(EntityType.User, userId, "Me")});
            Entities.Setup(e => e.ContactAsync(It.IsAny<IContactPointer>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync((IContactPointer pointer, CancellationToken _) => Usage.TryGetValue(pointer.EntityId, out var usage)
                    ? new Contact(pointer.EntityId, pointer.ChannelName, pointer.ContactName,
                        JsonSerializer.Serialize(usage), DateTime.UtcNow, null)
                    : null);
            Entities.Setup(e => e.ContactSetAsync(It.IsAny<IContactPointer>(), It.IsAny<string>(), null,
                    It.IsAny<CancellationToken>(), true, true, true, true))
                .Callback<IContactPointer, string, DateTime?, CancellationToken, bool, bool, bool, bool>(
                    (pointer, value, _, _, _, _, _, _) =>
                    {
                        Usage[pointer.EntityId] = JsonSerializer.Deserialize<Usage>(value)!;
                        Writes.Add(pointer);
                    })
                .Returns(Task.CompletedTask);
        }

        public void Enqueue(params QueueMessage[] messages) => batches.Enqueue(messages);

        public void FailWrites(string entityId, Exception exception) =>
            Entities.Setup(e => e.ContactSetAsync(It.Is<IContactPointer>(p => p.EntityId == entityId),
                    It.IsAny<string>(), null, It.IsAny<CancellationToken>(), true, true, true, true))
                .ThrowsAsync(exception);

        public Task RunAsync(CancellationToken cancellationToken = default) =>
            new UsageProcessTrigger(Entities.Object, Factory.Object, NullLogger<UsageProcessTrigger>.Instance)
                .Run(new TimerInfo(), cancellationToken);
    }
}
