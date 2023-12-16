using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Signal.Beacon.Core.Entity;
using JsonSerializer = System.Text.Json.JsonSerializer;

namespace Signal.Beacon.Application.Signal.Station;

internal class StationStateManager : IStationStateManager
{
    private readonly IStationStateService stationStateService;
    private readonly IWorkerServiceManager workerServiceManager;
    private readonly IEntitiesDao entitiesDao;
    private readonly IEntityService entityService;
    private readonly ILogger<StationStateManager> logger;

    private readonly CancellationTokenSource cts = new();
    private CancellationToken ManagerCancellationToken => this.cts.Token;


    public StationStateManager(
        IStationStateService stationStateService,
        IWorkerServiceManager workerServiceManager,
        IEntitiesDao entitiesDao,
        IEntityService entityService,
        ILogger<StationStateManager> logger)
    {
        this.stationStateService = stationStateService ?? throw new ArgumentNullException(nameof(stationStateService));
        this.workerServiceManager = workerServiceManager ?? throw new ArgumentNullException(nameof(workerServiceManager));
        this.entitiesDao = entitiesDao ?? throw new ArgumentNullException(nameof(entitiesDao));
        this.entityService = entityService ?? throw new ArgumentNullException(nameof(entityService));
        this.logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }


    public Task BeginMonitoringStateAsync(CancellationToken cancellationToken)
    {
        this.workerServiceManager.OnChange += this.WorkerServiceManagerOnOnChange;

        Task.Run(this.PeriodicStatusReportsAsync, cancellationToken);

        this.logger.LogDebug("Started monitoring station state...");

        return Task.CompletedTask;
    }

    private async Task PeriodicStatusReportsAsync()
    {
        while (!this.ManagerCancellationToken.IsCancellationRequested)
        {
            await this.StateChangedAsync(this.ManagerCancellationToken);
            await Task.Delay(TimeSpan.FromMinutes(3), this.ManagerCancellationToken);
        }
    }

    private void WorkerServiceManagerOnOnChange(object? _, IWorkerServiceManagerStateChangeEventArgs e) => _ = this.StateChangedAsync(this.ManagerCancellationToken);

    private async Task StateChangedAsync(CancellationToken cancellationToken)
    {
        try
        {
            var state = await this.stationStateService.GetAsync(cancellationToken);

            // Ensure station entity exists
            var stationEntity = await this.entitiesDao.GetAsync(state.Id, cancellationToken);
            if (stationEntity == null)
                await this.entityService.UpsertAsync(
                    EntityType.Station,
                    state.Id,
                    "Signalco Station",
                    cancellationToken);

            // Report state
            var pointer = new ContactPointer(state.Id, ChannelNames.StationDevice, string.Empty);
            await this.entityService.ContactSetAsync(
                pointer with {ContactName = "version"},
                state.Version,
                cancellationToken);
            await this.entityService.ContactSetAsync(
                pointer with {ContactName = "channels"},
                JsonSerializer.Serialize(state.WorkerServices),
                cancellationToken);
        }
        catch (Exception ex)
        {
            this.logger.LogTrace(ex, "Filed to report Station state to cloud");
            this.logger.LogDebug("Failed to report Station state to cloud");
        }
    }

    public void Dispose()
    {
        this.cts.Cancel();
    }
}