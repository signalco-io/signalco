using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Signal.Beacon.Application.Signal.Client.Entity;
using Signal.Beacon.Core.Entity;
using Signal.Beacon.Core.Signal;
using Process = Signal.Beacon.Core.Processes.Process;

namespace Signal.Beacon.Application;

internal class ProcessesDao : IProcessesDao
{
    private readonly ISignalcoEntityClient entityClient;
    private readonly ILogger<ProcessesDao> logger;
        
    // Caching
    private readonly object cacheLock = new();
    private DateTime? cacheExpiry;
    private static readonly TimeSpan CacheValidPeriod = TimeSpan.FromMinutes(60);

    private List<Process>? processes;
    private Task<IEnumerable<IEntityDetails>>? getProcessesTask;

    public ProcessesDao(
        ISignalcoEntityClient entityClient,
        ILogger<ProcessesDao> logger)
    {
        this.entityClient = entityClient ?? throw new ArgumentNullException(nameof(entityClient));
        this.logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<IEnumerable<Process>> GetAllAsync(CancellationToken cancellationToken)
    {
        await this.CacheProcessesAsync(cancellationToken);

        return this.processes ?? Enumerable.Empty<Process>();
    }
    
    private void ExtendCacheValidity(TimeSpan? duration = null)
    {
        this.cacheExpiry = DateTime.UtcNow + (duration ?? CacheValidPeriod);
        this.logger.LogDebug("Processes cache valid until {TimeStamp}", this.cacheExpiry.Value);
    }

    private async Task CacheProcessesAsync(CancellationToken cancellationToken)
    {
        if (cancellationToken.IsCancellationRequested)
        {
            this.logger.LogDebug("Aborted loading processes because cancellation token is cancelled");
            this.logger.LogDebug("Check who cancelled token. Stack: {StackTrace}", new StackTrace().ToString());
            return;
        }

        // Don't cache again if we have cache, and cache valid period didn't expire
        if (this.processes != null &&
            this.cacheExpiry.HasValue &&
            DateTime.UtcNow - this.cacheExpiry.Value <= TimeSpan.Zero)
            return;

        try
        {
            this.logger.LogDebug("Loading processes...");

            this.getProcessesTask ??= this.entityClient.AllAsync(cancellationToken);

            var remoteProcesses = (await this.getProcessesTask).ToList().Where(e => e.Type == EntityType.Process);

            lock (this.cacheLock)
            {
                if (this.processes != null &&
                    this.cacheExpiry.HasValue &&
                    DateTime.UtcNow - this.cacheExpiry.Value <= TimeSpan.Zero)
                    return;

                try
                {
                    this.processes = new List<Process>();
                    foreach (var process in remoteProcesses)
                        this.processes.Add(new Process(process.Id, process.Alias,
                            process.ContactOrDefault("config", "configuration").ValueSerialized));

                    // Invalidate dependency caches
                    this.ExtendCacheValidity();

                    this.logger.LogDebug("Loaded {ProcessesCount} processes.", this.processes.Count);
                }
                finally
                {
                    this.getProcessesTask = null;
                }
            }
        }
        catch (HttpRequestException ex) when (ex.StatusCode == HttpStatusCode.ServiceUnavailable)
        {
            // Throw if we don't have local cache
            if (this.processes == null)
                throw;

            this.logger.LogWarning("Can't revalidate processes cache because cloud is unavailable");
            this.ExtendCacheValidity();
        }
        catch (TaskCanceledException)
        {
            // Throw if we don't have local cache
            if (this.processes == null)
                throw;

            this.logger.LogWarning("Can't revalidate processes cache - timeout");
            this.ExtendCacheValidity();
        }
        catch (Exception ex)
        {
            this.logger.LogDebug(ex, "Failed to cache processes.");
            throw;
        }
    }
}