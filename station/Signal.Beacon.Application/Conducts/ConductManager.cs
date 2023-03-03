using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Signal.Beacon.Application.PubSub;
using Signal.Beacon.Application.Signal.SignalR;
using Signal.Beacon.Core.Architecture;
using Signal.Beacon.Core.Conducts;
using Signal.Beacon.Core.Entity;
using Signal.Beacon.Core.Structures.Queues;

namespace Signal.Beacon.Application.Conducts;

internal class ConductManager : IConductManager, ICommandHandler<ConductPublishCommand>
{
    private readonly IPubSubTopicHub<IConduct> conductHub;
    private readonly ISignalSignalRConductsHubClient signalRConductsHubClient;
    private readonly IEntitiesDao entitiesDao;
    private readonly IDelayedQueue<IConduct> delayedConducts = new DelayedQueue<IConduct>();
    private readonly ILogger<ConductManager> logger;


    public ConductManager(
        IPubSubTopicHub<IConduct> conductHub,
        ISignalSignalRConductsHubClient signalRConductsHubClient,
        IEntitiesDao entitiesDao,
        ILogger<ConductManager> logger)
    {
        this.conductHub = conductHub ?? throw new ArgumentNullException(nameof(conductHub));
        this.signalRConductsHubClient = signalRConductsHubClient ?? throw new ArgumentNullException(nameof(signalRConductsHubClient));
        this.entitiesDao = entitiesDao ?? throw new ArgumentNullException(nameof(entitiesDao));
        this.logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task HandleAsync(ConductPublishCommand command, CancellationToken cancellationToken) => 
        await this.PublishAsync(command.Conducts, cancellationToken);

    public Task StartAsync(CancellationToken cancellationToken)
    {
        this.signalRConductsHubClient.OnConductRequest(
            (req, token) => this.ConductRequestedMultipleHandlerAsync(new []{req}, token),
            cancellationToken);

        this.signalRConductsHubClient.OnConductRequestMultiple(
            this.ConductRequestedMultipleHandlerAsync,
            cancellationToken);

        _ = Task.Run(async () => await this.DelayedConductsLoop(cancellationToken), cancellationToken);

        return Task.CompletedTask;
    }

    private async Task ConductRequestedMultipleHandlerAsync(IEnumerable<ConductRequestDto> requests, CancellationToken cancellationToken)
    {
        await this.PublishAsync(requests
            .Select(request => new Conduct(
                new ContactPointer(
                    request.EntityId ?? throw new InvalidOperationException(),
                    request.ChannelName ?? throw new InvalidOperationException(),
                    request.ContactName ?? throw new InvalidOperationException()),
                request.ValueSerialized,
                request.Delay ?? 0)), 
            cancellationToken);
    }
        
    private async Task DelayedConductsLoop(CancellationToken cancellationToken)
    {
        await foreach (var conduct in this.delayedConducts.WithCancellation(cancellationToken))
            await this.PublishInternalAsync(new[] {conduct}, cancellationToken);
    }

    public IDisposable Subscribe(string channel, Func<IEnumerable<IConduct>, CancellationToken, Task> handler) =>
        this.conductHub.Subscribe(new[] {channel}, handler);

    public async Task PublishAsync(IEnumerable<IConduct> conducts, CancellationToken cancellationToken)
    {
        var conductsList = conducts as IList<IConduct> ?? conducts.ToList();
            
        // Enqueue delayed
        this.delayedConducts.Enqueue(
            conductsList.Where(c => c.Delay > 0),
            c => TimeSpan.FromMilliseconds(c.Delay));

        // Publish non-delayed conducts
        await this.PublishInternalAsync(conductsList.Where(c => c.Delay <= 0), cancellationToken);
    }

    private async Task PublishInternalAsync(IEnumerable<IConduct> conducts, CancellationToken cancellationToken)
    {
        try
        {
            var enumerable = conducts as IList<IConduct> ?? conducts.ToList();
            foreach (var conduct in enumerable)
                this.logger.LogDebug("Publishing conduct {Pointer}: \"{ValueSerialized}\" (after {Delay}ms)", 
                    conduct.Pointer,
                    conduct.ValueSerialized,
                    conduct.Delay);

            await Task.WhenAll(
                enumerable
                    .GroupBy(c => c.Pointer.ChannelName)
                    .Select(cGroup => this.conductHub.PublishAsync(cGroup.Key, cGroup, cancellationToken)));

            // TODO: Publish to SignalR if no local handler successfully handled the conduct
        }
        catch (Exception ex)
        {
            this.logger.LogDebug(ex, "Unhandled conducts publish exception.");
            this.logger.LogWarning("Publishing conducts failed.");
        }
    }
}