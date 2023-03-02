using System;
using System.Diagnostics;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Signal.Beacon.Core.Shell;

namespace Signal.Beacon.Application.Shell;

internal class LinuxShellService : IShellService
{
    private readonly ILogger<LinuxShellService> logger;

    public LinuxShellService(
        ILogger<LinuxShellService> logger)
    {
        this.logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task ExecuteShellCommandAsync(string command, CancellationToken cancellationToken)
    {
        using var process = new Process();
        var processRef = new WeakReference<Process>(process);
        process.StartInfo = new ProcessStartInfo
        {
            FileName = "/bin/bash",
            Arguments = $"-c \"{command}\""
        };

        _ = Task.Run(() =>
        {
            while (processRef.TryGetTarget(out var proc) && !proc.HasExited &&
                   !cancellationToken.IsCancellationRequested)
            {
                var errorLine = proc.StandardError.ReadLine();
                this.logger.LogDebug("Update ERROR > {Line}", errorLine);
            }
        }, cancellationToken);

        _ = Task.Run(() =>
        {
            while (processRef.TryGetTarget(out var proc) && !proc.HasExited &&
                   !cancellationToken.IsCancellationRequested)
            {
                var outputLine = proc.StandardOutput.ReadLine();
                this.logger.LogDebug("Update INFO > {Line}", outputLine);
            }
        }, cancellationToken);

        process.Start();

        await process.WaitForExitAsync(cancellationToken);
    }
}