using System.Net.Http.Json;
using Signal.Core.Auth;
using Signal.Core.Conducts;
using Signal.Core.Contacts;
using Signal.Core.Entities;
using Signal.Core.Processor;
using Signal.Core.Secrets;
using Signal.Core.Storage;
using Signalco.Infrastructure.Processor.Configuration.Schemas;
using ContactPointer = Signal.Core.Contacts.ContactPointer;
using JsonSerializer = System.Text.Json.JsonSerializer;

namespace Signalco.Infrastructure.Processor;

internal class Processor(
    IEntityService entityService,
    IProcessService processService,
    ISecretsProvider secretsProvider,
    IAzureStorage storage)
    : IProcessor
{
    public async Task RunProcessAsync(
        string processEntityId,
        IContactPointer? trigger,
        bool instant,
        CancellationToken cancellationToken = default)
    {
        if (processEntityId == null) throw new ArgumentNullException(nameof(processEntityId));

        try
        {
            var start = DateTime.UtcNow;

            var disabledContactTask = entityService.ContactAsync(
                new ContactPointer(processEntityId, "signalco", "disabled"),
                cancellationToken);
            var configTask = processService.GetConfigurationAsync(processEntityId, cancellationToken);

            await Task.WhenAll(disabledContactTask, configTask);

            // Skip if disabled or process has no conducts
            if (disabledContactTask.Result?.ValueSerialized?.ToLowerInvariant() == "true" ||
                configTask.Result?.Conducts is not {Count: > 0})
                return;

            var conductTasks = new Dictionary<string, Task<ConductResult>>();
            foreach (var configConduct in configTask.Result.Conducts)
            {
                var conductId = configConduct.Id ?? Guid.NewGuid().ToString();

                // Determine whether this needs to run or be skipped
                var task = ConditionsHelper.ShouldTrigger(configConduct.Conditions ?? Enumerable.Empty<Condition>(), trigger)
                    ? this.ProcessConductAsync(configConduct, conductTasks, cancellationToken)
                    : Task.FromResult(ConductResult.Skipped(conductId));

                conductTasks.Add(conductId, task);
            }

            var results = await Task.WhenAll(conductTasks.Values);

            await this.ReportExecutedAsync(
                processEntityId, trigger, instant, results,
                start, DateTime.UtcNow,  cancellationToken);
        }
        catch (Exception ex)
        {
            await this.ReportProcessErrorAsync(processEntityId, ex, cancellationToken);
        }
    }

    private async Task ReportExecutedAsync(
        string processEntityId,
        IContactPointer? trigger,
        bool instant,
        ConductResult[] conductResults,
        DateTime start,
        DateTime end,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var pointer = new ContactPointer(processEntityId, "signalco", "executed");
            var executedTask = entityService.ContactSetAsync(
                pointer,
                JsonSerializer.Serialize(new
                {
                    IsSuccessful = conductResults.All(cr => cr.State is ConductResultState.Complete or ConductResultState.Skipped),
                    Instant = instant,
                    Trigger = trigger,
                    StartTimeStamp = start,
                    EndTimeStamp = end,
                    ConductResults = conductResults
                }),
                null,
                cancellationToken,
                true);

            var usageTask = this.ReportUsageAsync(processEntityId, conductResults, cancellationToken);

            await Task.WhenAll(executedTask, usageTask);
        }
        catch
        {
            // Can't do much, don't throw to avoid circular errors
        }
    }

    private async Task ReportUsageAsync(
        string processEntityId,
        ConductResult[] conductResults,
        CancellationToken cancellationToken = default)
    {
        try
        {
            // Ignore if all conducts skipped
            if (conductResults.All(cr => cr.State == ConductResultState.Skipped))
                return;

            // TODO: Properly resolve owner of process
            // Resolve process entity user - will use that user as owner
            var processUsers =
                await entityService.EntityUsersAsync(new[] {processEntityId}, cancellationToken);
            var processUserId = processUsers.FirstOrDefault().Value.FirstOrDefault();

            // Report process executed
            await storage.QueueAsync(
                new UsageQueueItem(
                    processUserId ?? throw new InvalidOperationException("Process user not found"),
                    UsageKind.Process),
                cancellationToken);

            // TODO: Report all at once (maybe Value in UsageQueueItem?)
            // Report conducts executed
            var executedConducts = conductResults
                .Where(c => c is {State: ConductResultState.Complete, ConductsCount: { }})
                .Sum(c => c.ConductsCount ?? 0);
            await Task.WhenAll(
                Enumerable.Repeat(
                    storage.QueueAsync(
                        new UsageQueueItem(
                            processUserId ?? throw new InvalidOperationException("Process user not found"),
                            UsageKind.Conduct),
                        cancellationToken),
                    executedConducts));
        }
        catch
        {
            // TODO: Log failed to increment usage for process execution
        }
    }

    private async Task ReportProcessErrorAsync(string processEntityId, Exception ex, CancellationToken cancellationToken = default)
    {
        try
        {
            // Ignore if already reported
            var pointer = new ContactPointer(processEntityId, "signalco", "configurationError");
            var contact = await entityService.ContactAsync(pointer, cancellationToken);
            if (contact != null &&
                contact.ValueSerialized == ex.Message)
                return;

            await entityService.ContactSetAsync(
                pointer,
                ex.Message,
                null,
                cancellationToken,
                true);
        }
        catch
        {
            // Can't do much, don't throw to avoid circular errors
            // TODO: Log failed error - not reported to user
        }
    }

    private async Task<ConductResult> ProcessConductAsync(
        Conduct conduct,
        IReadOnlyDictionary<string, Task<ConductResult>> conductTasks,
        CancellationToken cancellationToken = default)
    {
        var start = DateTime.UtcNow;

        try
        {
            // Determine whether conditions are met
            // TODO: Save execution log (what executed and why)
            if (!await this.ConditionsMetAsync(conduct.Conditions ?? Enumerable.Empty<Condition>(),
                    cancellationToken))
                return ConductResult.ConditionsNotMet(
                    conduct.Id ?? throw new ArgumentException("Conduct identifier missing"),
                    start,
                    DateTime.UtcNow);

            // Wait for dependency conduct
            if (!string.IsNullOrWhiteSpace(conduct.NotBeforeConduct) &&
                conductTasks.ContainsKey(conduct.NotBeforeConduct))
            {
                var result = await conductTasks[conduct.NotBeforeConduct];

                // Break if dependency not completed
                if (!conductTasks[conduct.NotBeforeConduct].IsCompletedSuccessfully ||
                    result.State != ConductResultState.Complete)
                    return ConductResult.DependencyFailed(
                        conduct.Id ?? throw new ArgumentException("Conduct identifier missing"),
                        start,
                        DateTime.UtcNow,
                        new List<string> {conduct.NotBeforeConduct});
            }

            // TODO: Queue rest of the conduct if delay is longer than N (eg. 60s)
            if (conduct.DelayBefore.HasValue)
                await Task.Delay(TimeSpan.FromMilliseconds(conduct.DelayBefore.Value), cancellationToken);

            // TODO: Throw execution error
            var conductsCount = 0;
            if (conduct is ConductEntityContact {Contacts: { }} conductContact)
            {
                conductsCount = conductContact.Contacts.Count;
                await this.ExecuteConductsAsync(conductContact.Contacts, cancellationToken);
            }

            // TODO: Queue rest of the conduct if delay is longer than N (eg. 60s)
            if (conduct.DelayAfter.HasValue)
                await Task.Delay(TimeSpan.FromMilliseconds(conduct.DelayAfter.Value), cancellationToken);

            // TODO: Add more info: which conditions were met
            return ConductResult.Successful(
                conduct.Id ?? throw new ArgumentException("Conduct identifier missing"),
                start,
                DateTime.UtcNow,
                conductsCount);
        }
        catch (Exception ex)
        {
            return ConductResult.Failed(
                conduct.Id ?? throw new ArgumentException("Conduct identifier missing"),
                start,
                DateTime.UtcNow,
                ex);
        }
    }

    private async Task<bool> ConditionsMetAsync(IEnumerable<Condition> conditions, CancellationToken cancellationToken = default)
    {
        var conditionsList = conditions.ToList();
        if (!conditionsList.Any())
            return true;

        // NOTE: Don't execute in parallel because in AND statement we can abort early if condition is not met
        foreach (var condition in conditionsList)
            if (!IsTrueLike(await this.ConditionMetAsync(condition, cancellationToken)))
                return false;
        return true;
    }

    private static bool IsTrueLike(string? arg)
    {
        if (string.IsNullOrEmpty(arg))
            return false;
        if (arg.ToLowerInvariant() == "false")
            return false;
        if (double.TryParse(arg, out var numeric) &&
            (double.IsNaN(numeric) || numeric == 0))
            return false;
        return true;
    }

    private async Task<string?> ConditionMetAsync(Condition? condition, CancellationToken cancellationToken = default)
    {
        return condition switch
        {
            ConditionCompare c => await this.ConditionMetAsync(c, cancellationToken) ? true.ToString() : false.ToString(),
            ConditionConst c => await ConditionMetAsync(c),
            ConditionContact c => await this.ConditionMetAsync(c, cancellationToken),
            ConditionOrGroup c => await this.ConditionMetAsync(c, cancellationToken) ? true.ToString() : false.ToString(),
            _ => throw new NotSupportedException("Unknown condition type")
        };
    }

    private async Task<string?> ConditionMetAsync(ConditionContact condition, CancellationToken cancellationToken = default)
    {
        if (condition.ContactPointer?.EntityId == null ||
            condition.ContactPointer.ChannelName == null ||
            condition.ContactPointer.ContactName == null)
            throw new NotSupportedException("Partial contact not supported");

        var contact = await entityService.ContactAsync(
            new ContactPointer(
                condition.ContactPointer.EntityId,
                condition.ContactPointer.ChannelName,
                condition.ContactPointer.ContactName),
            cancellationToken);
        return contact?.ValueSerialized;
    }

    private static Task<string?> ConditionMetAsync(ConditionConst condition) =>
        Task.FromResult(condition.ValueSerialized);

    private async Task<bool> ConditionMetAsync(ConditionCompare condition, CancellationToken cancellationToken = default)
    {
        var leftConditionTask = this.ConditionMetAsync(condition.Left, cancellationToken);
        var rightConditionTask = this.ConditionMetAsync(condition.Right, cancellationToken);
        await Task.WhenAll(leftConditionTask, rightConditionTask);
        return await ApplyOperationAsync(condition.Operation, leftConditionTask.Result, rightConditionTask.Result);
    }

    private static Task<bool> ApplyOperationAsync(CompareOperation operation, string? a, string? b)
    {
        return TryCompareTime(operation, a, b, out var result) ||
               TryCompareNumbers(operation, a, b, out result)
            ? Task.FromResult(result ?? throw new Exception("Unexpected comparison result"))
            : Task.FromResult(CompareStrings(operation, a, b));
    }

    private static bool TryCompareTime(CompareOperation operation, string? a, string? b, out bool? result)
    {
        result = null;

        if (DateTime.TryParse(a, out var aDateTime) &&
            DateTime.TryParse(b, out var bDateTime))
            TryCompareNumbers(
                operation,
                aDateTime.TimeOfDay.ToString(),
                bDateTime.TimeOfDay.ToString(),
                out result);

        return result != null;
    }

    private static bool TryCompareNumbers(CompareOperation operation, string? a, string? b, out bool? result)
    {
        result = null;

        if (double.TryParse(a, out var aNumber) &&
            double.TryParse(b, out var bNumber))
        {
            result = operation switch
            {
                CompareOperation.Equal => Math.Abs(aNumber - bNumber) < double.Epsilon,
                CompareOperation.NotEqual => Math.Abs(aNumber - bNumber) > double.Epsilon,
                CompareOperation.LessThan => aNumber < bNumber,
                CompareOperation.LessThanOrEqual => aNumber <= bNumber,
                CompareOperation.GreaterThan => aNumber > bNumber,
                CompareOperation.GreaterThanOrEqual => aNumber >= bNumber,
                _ => null
            };
        }

        return result != null;
    }

    private static bool CompareStrings(CompareOperation operation, string? a, string? b)
    {
        return operation switch
        {
            CompareOperation.Equal => a == b,
            CompareOperation.NotEqual => a != b,
            CompareOperation.LessThan => string.CompareOrdinal(a, b) < 0,
            CompareOperation.LessThanOrEqual => string.CompareOrdinal(a, b) <= 0,
            CompareOperation.GreaterThan => string.CompareOrdinal(a, b) > 0,
            CompareOperation.GreaterThanOrEqual => string.CompareOrdinal(a, b) >= 0,
            _ => throw new ArgumentOutOfRangeException(nameof(operation), operation, null)
        };
    }

    private async Task<bool> ConditionMetAsync(ConditionOrGroup condition, CancellationToken cancellationToken = default)
    {
        if (condition.Conditions == null)
            return false;

        // NOTE: Don't execute in parallel because in OR statement we can abort early if condition is met
        foreach (var groupCondition in condition.Conditions)
            if (IsTrueLike(await this.ConditionMetAsync(groupCondition, cancellationToken)))
                return true;

        return false;
    }


    private async Task ExecuteConductsAsync(IEnumerable<ConductContact> conductContacts, CancellationToken cancellationToken = default)
    {
        // Group by channel
        var channelConductContacts = conductContacts
            .Where(cc => !string.IsNullOrWhiteSpace(cc.ContactPointer?.ChannelName))
            .GroupBy(cc => cc.ContactPointer?.ChannelName);

        // TODO: Use client factory
        var errors = new List<Exception>();

        var accessCode = await secretsProvider.GetSecretAsync(SecretKeys.ProcessorAccessCode, cancellationToken);
        var conductTasks = channelConductContacts.Select(async channelConducts =>
        {
            try
            {
                var channelConductRequests = channelConducts
                    .Where(cc => cc.ContactPointer is {EntityId: { }, ChannelName: { }, ContactName: { }})
                    .Select(cc => new ConductRequestDto
                    {
                        EntityId = cc.ContactPointer?.EntityId,
                        ChannelName = channelConducts.Key,
                        ContactName = cc.ContactPointer?.ContactName,
                        ValueSerialized = cc.ValueSerialized
                    })
                    .ToList();

                // TODO: Switch prod/dev endpoints depending on deployment slot
                using var client = new HttpClient();
                client.DefaultRequestHeaders.Add(
                    KnownHeaders.ProcessorAccessCode,
                    accessCode);
                await client.PostAsJsonAsync(
                    $"https://{channelConducts.Key}.channel.api.signalco.io/api/conducts/request-multiple",
                    channelConductRequests,
                    cancellationToken: cancellationToken);
            }
            catch (Exception ex)
            {
                errors.Add(ex);
            }
        });

        await Task.WhenAll(conductTasks);

        if (errors.Any())
            throw new AggregateException(errors);
    }

    [Serializable]
    public record ConductResult(ConductResultState State, string ConductId)
    {
        public DateTime? EndTimeStamp { get; set; }

        public DateTime? StartTimeStamp { get; set; }

        public IEnumerable<string>? DependencyIds { get; set; }

        public int? ConductsCount { get; set; }

        public Exception? Error { get; set; }

        public static ConductResult Failed(string conductId, DateTime start, DateTime end, Exception error) => new(ConductResultState.Failed, conductId)
        {
            StartTimeStamp = start,
            EndTimeStamp = end,
            Error = error
        };

        public static ConductResult Skipped(string conductId) => new(ConductResultState.Skipped, conductId);

        public static ConductResult ConditionsNotMet(string conductId, DateTime start, DateTime end) =>
            new(ConductResultState.ConditionsNotMet, conductId)
            {
                StartTimeStamp = start,
                EndTimeStamp = end,
            };

        public static ConductResult DependencyFailed(string conductId, DateTime start, DateTime end, IEnumerable<string> dependencies) => new(ConductResultState.DependencyFailed, conductId)
        {
            StartTimeStamp = start,
            EndTimeStamp = end,
            DependencyIds = dependencies
        };

        public static ConductResult Successful(string conductId, DateTime start, DateTime end, int conductsCount) => new(ConductResultState.Complete, conductId)
        {
            StartTimeStamp = start,
            EndTimeStamp = end,
            ConductsCount = conductsCount
        };
    }

    public enum ConductResultState
    {
        Unknown = 0,
        Failed = 1,
        Skipped = 2,
        DependencyFailed = 3,
        ConditionsNotMet = 4,
        Complete = 5
    }
}