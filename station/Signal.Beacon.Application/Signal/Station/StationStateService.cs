using System;
using System.Reflection;
using System.Threading;
using System.Threading.Tasks;

namespace Signal.Beacon.Application.Signal.Station;

internal class StationStateService : IStationStateService
{
    private readonly IConfigurationService configurationService;
    private readonly Lazy<IWorkerServiceManager> workerServiceManager;

    public StationStateService(
        IConfigurationService configurationService,
        Lazy<IWorkerServiceManager> workerServiceManager)
    {
        this.configurationService = configurationService ?? throw new ArgumentNullException(nameof(configurationService));
        this.workerServiceManager = workerServiceManager ?? throw new ArgumentNullException(nameof(workerServiceManager));
    }

    public async Task<StationState> GetAsync(CancellationToken cancellationToken)
    {
        var config = await this.configurationService.LoadAsync<StationConfiguration>("beacon.json", cancellationToken);
        if (string.IsNullOrWhiteSpace(config.Id))
            throw new Exception("Can't generate state report without id.");

        return new StationState
        {
            Id = config.Id,
            Version = Assembly.GetEntryAssembly()?.GetName().Version?.ToString() ?? "Unknown",
            WorkerServices = this.workerServiceManager.Value.WorkerServices
        };
    }
}