using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Signal.Beacon.Application.Conducts;
using Signal.Beacon.Core.Conditions;
using Signal.Beacon.Core.Conducts;
using Signal.Beacon.Core.Entity;
using Signal.Beacon.Core.Processes;
using Signal.Beacon.Core.Structures.Queues;

namespace Signal.Beacon.Application.Processing;

internal class Processor : IProcessor
{
    private readonly IConditionEvaluatorService conditionEvaluatorService;
    private readonly IProcessesService processesService;
    private readonly IConductManager conductManager;
    private readonly ILogger<Processor> logger;

    private readonly IDelayedQueue<Process> delayedTriggers = new DelayedQueue<Process>();


    public Processor(
        IConditionEvaluatorService conditionEvaluatorService,
        IProcessesService processesService,
        IConductManager conductManager,
        ILogger<Processor> logger)
    {
        this.conditionEvaluatorService = conditionEvaluatorService ?? throw new ArgumentNullException(nameof(conditionEvaluatorService));
        this.processesService = processesService ?? throw new ArgumentNullException(nameof(processesService));
        this.conductManager = conductManager ?? throw new ArgumentNullException(nameof(conductManager));
        this.logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }


    public Task StartAsync(CancellationToken cancellationToken)
    {
        // Subscribe to state changes
        //this.deviceStateManager.Subscribe(this.ProcessStateChangedAsync);
        _ = Task.Run(() => this.DelayedTriggersLoop(cancellationToken), cancellationToken);

        return Task.CompletedTask;
    }

    private async Task DelayedTriggersLoop(CancellationToken cancellationToken)
    {
        await foreach (var process in this.delayedTriggers.WithCancellation(cancellationToken))
            await this.EvaluateAndExecute(new[] { process }, cancellationToken);
    }

    public Task StopAsync(CancellationToken cancellationToken)
    {
        return Task.CompletedTask;
    }

    private async Task ProcessStateChangedAsync(IEnumerable<IContactPointer> targets, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
        //foreach (var target in targets)
        //{
        //    var processes = await this.processesService.GetAllAsync(cancellationToken);
        //    var applicableProcesses = processes
        //        .Where(p => !p.IsDisabled)
        //        .Where(p =>
        //            p.Configuration is StateTriggerProcessConfiguration pc &&
        //            (pc.Triggers?.Any(t => t == target) ?? false))
        //        .ToList();
        //    if (!applicableProcesses.Any())
        //    {
        //        this.logger.LogTrace("Change on target {DeviceEndpointTarget} ignored.", target);
        //        return;
        //    }

        //    // Queue delayed triggers
        //    foreach (var delayedStateTriggerProcess in applicableProcesses.Where(p =>
        //        (p.Configuration as StateTriggerProcessConfiguration)?.Delay > 0))
        //        this.delayedTriggers.Enqueue(delayedStateTriggerProcess, TimeSpan.FromMilliseconds(
        //            (delayedStateTriggerProcess.Configuration as StateTriggerProcessConfiguration)?.Delay ?? 0));

        //    // Trigger no-delay processes immediately
        //    await this.EvaluateAndExecute(
        //        applicableProcesses.Where(p => (p.Configuration as StateTriggerProcessConfiguration)?.Delay <= 0),
        //        cancellationToken);
        //}
    }

    private async Task EvaluateAndExecute(IEnumerable<Process> applicableProcesses, CancellationToken cancellationToken)
    {
        var conducts = new List<IConduct>();

        // Collect all process conducts that meet conditions
        foreach (var process in applicableProcesses)
        {
            try
            {
                throw new NotImplementedException();
                //var configuration = process.Configuration as StateTriggerProcessConfiguration;
                //if (configuration == null)
                //{
                //    this.logger.LogDebug("Process {ProcessId} has no state trigger configuration. Ignored.", process.Id);
                //    continue;
                //}

                //if (configuration.Conducts == null) 
                //    return;

                //// Ignore if condition not met
                //if (!await this.conditionEvaluatorService.IsConditionMetAsync(configuration.Condition, cancellationToken))
                //    continue;

                //// Queue conducts
                //this.logger.LogInformation(
                //    "Process \"{ProcessName}\" queued...",
                //    process.Alias);
                //conducts.AddRange(configuration.Conducts);
            }
            catch (Exception ex)
            {
                this.logger.LogWarning(ex,
                    "StateTriggerProcess condition invalid. Recheck your configuration. ProcessName: {ProcessName}",
                    process.Alias);
            }
        }

        // Execute all immediate conducts
        await this.conductManager.PublishAsync(conducts, cancellationToken);
    }
}