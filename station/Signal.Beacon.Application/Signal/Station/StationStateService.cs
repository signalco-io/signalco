using System;
using System.Linq;
using System.Reflection;
using System.Threading;
using System.Threading.Tasks;
using Signal.Beacon.Core.Configuration;

namespace Signal.Beacon.Application.Signal.Station;

internal class StationStateService : IStationStateService
{
    private readonly IConfigurationService configurationService;
    private readonly IWorkerServiceManager workerServiceManager;

    public StationStateService(
        IConfigurationService configurationService,
        IWorkerServiceManager workerServiceManager)
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
            AvailableWorkerServices = this.workerServiceManager.AvailableWorkerServices.Select(ws => ws.GetType().FullName ?? "Unknown"),
            RunningWorkerServices = this.workerServiceManager.RunningWorkerServices.Select(ws => ws.GetType().FullName ?? "Unknown")
        };
    }
}