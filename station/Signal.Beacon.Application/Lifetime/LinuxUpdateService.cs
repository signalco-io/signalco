using System;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Signal.Beacon.Application.Signal.Station;
using Signal.Beacon.Core.Entity;
using Signal.Beacon.Core.Shell;

namespace Signal.Beacon.Application.Lifetime;

public class LinuxUpdateService : IUpdateService
{
    private const string FilePathExecute = "./rpi-update.sh";

    private readonly IStationStateService stateService;
    private readonly IEntitiesDao entitiesDao;
    private readonly IShellService shell;
    private readonly ILogger<LinuxUpdateService> logger;

    public LinuxUpdateService(
        IStationStateService stateService,
        IEntitiesDao entitiesDao,
        IShellService shell,
        ILogger<LinuxUpdateService> logger)
    {
        this.stateService = stateService ?? throw new ArgumentNullException(nameof(stateService));
        this.entitiesDao = entitiesDao ?? throw new ArgumentNullException(nameof(entitiesDao));
        this.shell = shell ?? throw new ArgumentNullException(nameof(shell));
        this.logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task ShutdownSystemAsync()
    {
        this.logger.LogInformation("Requested system shutdown. Executing...");
        await this.shell.ExecuteShellCommandAsync("sudo shutdown -P now", CancellationToken.None);
    }

    public Task RestartStationAsync()
    {
        this.logger.LogInformation("Requested station restart...");

        // Exiting the application will restart the service
        Environment.Exit(0);
        return Task.CompletedTask;
    }

    public async Task RestartSystemAsync()
    {
        this.logger.LogInformation("Requested system restart. Executing...");
        await this.shell.ExecuteShellCommandAsync("sudo shutdown -r now", CancellationToken.None);
    }

    public async Task UpdateSystemAsync(CancellationToken cancellationToken)
    {
        this.logger.LogInformation("Requested system update. Executing...");
        await this.shell.ExecuteShellCommandAsync("for i in update {,dist-}upgrade auto{remove,clean}; do sudo apt-get $i -y; done", cancellationToken);
    }

    public async Task BeginUpdateAsync(CancellationToken cancellationToken)
    {
        this.logger.LogDebug("Setting permission for update script...");
        await this.shell.ExecuteShellCommandAsync($"chmod +x {FilePathExecute}", cancellationToken);

        // Determine current channel
        var releaseChannelArg = string.Empty;
        var state = await this.stateService.GetAsync(cancellationToken);
        var stationReleaseChannel = await this.entitiesDao.ContactValueSerializedAsync(
            new ContactPointer(state.Id, ChannelNames.StationDevice, "stationReleaseChannel"),
            cancellationToken);
        if (stationReleaseChannel == "next")
            releaseChannelArg = "--next";

        this.logger.LogInformation("Starting station update...");
        var fileInfo = new FileInfo(FilePathExecute);
        await this.shell.ExecuteShellCommandAsync($"sudo {fileInfo.FullName} {releaseChannelArg}", cancellationToken);
    }
}