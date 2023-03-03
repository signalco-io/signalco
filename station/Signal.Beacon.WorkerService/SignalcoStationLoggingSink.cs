using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Serilog.Core;
using Serilog.Events;
using Signal.Beacon.Application.Signal.Client.Station;
using Signal.Beacon.Application.Signal.Station;
using Signal.Beacon.Core.Signal;

namespace Signal.Beacon;

public class SignalcoStationLoggingSink : ILogEventSink
{
    private readonly Lazy<IStationStateService> stationStateService;
    private readonly Lazy<ISignalcoStationClient> client;
    private DateTime? lastSent = DateTime.UtcNow;
    private readonly ConcurrentBag<LogEvent> outbox = new();
    private readonly TimeSpan batchPeriod = TimeSpan.FromSeconds(10);
    private string? stationId;

    public SignalcoStationLoggingSink(Lazy<IStationStateService> stationStateService, Lazy<ISignalcoStationClient> client)
    {
        this.stationStateService = stationStateService ?? throw new ArgumentNullException(nameof(stationStateService));
        this.client = client ?? throw new ArgumentNullException(nameof(client));
    }

    public async void Emit(LogEvent logEvent)
    {
        if (logEvent.Level == LogEventLevel.Verbose)
            return;

        // Push to outbox
        this.outbox.Add(logEvent);

        // Check if we need to send outbox batch
        if (this.lastSent != null && DateTime.UtcNow - this.lastSent <= this.batchPeriod) 
            return;

        // Take all from outbox
        var toSend = new List<LogEvent>(this.outbox.Count);
        lock (this.outbox)
        {
            this.lastSent = DateTime.UtcNow;
            while(this.outbox.TryTake(out var item))
                toSend.Add(item);
        }

        try
        {
            await this.client.Value.LogAsync(
                await this.GetStationIdAsync(),
                toSend.Select(i => new Entry(i.Timestamp, (int) i.Level, i.RenderMessage())),
                CancellationToken.None);
        }
        catch
        {
            // Failed to log
        }
    }

    private async Task<string> GetStationIdAsync() => this.stationId ??= (await this.stationStateService.Value.GetAsync(CancellationToken.None)).Id;

    private record Entry(DateTimeOffset TimeStamp, int Level, string Message) : ISignalcoStationLoggingEntry;
}