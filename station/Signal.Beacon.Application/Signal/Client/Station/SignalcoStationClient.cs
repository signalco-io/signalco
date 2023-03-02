using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Signal.Beacon.Core.Signal;

namespace Signal.Beacon.Application.Signal.Client.Station;

internal class SignalcoStationClient : ISignalcoStationClient
{
    private const string SignalApiStationLoggingPersistUrl = "/station/logging/persist";

    private readonly ISignalClient client;
    private readonly ILogger<SignalcoStationClient> logger;

    public SignalcoStationClient(
        ISignalClient client,
        ILogger<SignalcoStationClient> logger)
    {
        this.client = client ?? throw new ArgumentNullException(nameof(client));
        this.logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task LogAsync(string stationId, IEnumerable<ISignalcoStationLoggingEntry> entries, CancellationToken cancellationToken)
    {
        try
        {
            var payload = new SignalcoLoggingStationRequestDto(
                stationId,
                entries.Select(e => new SignalcoLoggingStationEntryDto(e.TimeStamp, e.Level, e.Message)).ToList());

            await this.client.PostAsJsonAsync(
                SignalApiStationLoggingPersistUrl,
                payload,
                cancellationToken);
        }
        catch (Exception ex)
        {
            this.logger.LogDebug("Failed to log to cloud.");
            this.logger.LogTrace(ex, "Station logging failed.");
        }
    }
}