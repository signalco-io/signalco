using System.Threading;
using System.Threading.Tasks;
using Microsoft.Azure.Functions.Worker;
using Signal.Core.Entities;
using Signal.Core.Storage;

namespace Signalco.Func.Internal.Migration;

public class MigrationFunction(
    IEntityService entityService,
    IAzureStorageDao dao,
    IAzureStorage azureStorage)
{
    private const string CronOnceAYear = "0 0 0 1 1 *";

    private readonly string[] tablesNames = {
        "entities", "contacts", "contactshistory", "userassignedentity",
        "pats",
        "users",
        "webnewsletter",
        "contactLinks"
    };
    private readonly string[] queueNames = {
        "contact-state-processing", "usage-processing"
    };

    [Function("Migration")]
    public async Task Run(
        [TimerTrigger(CronOnceAYear, RunOnStartup = true)] TimerInfo timer,
        CancellationToken cancellationToken = default)
    {
        foreach (var tableName in tablesNames)
            await azureStorage.EnsureTableAsync(tableName, cancellationToken);

        foreach (var queueName in queueNames)
            await azureStorage.EnsureQueueAsync(queueName, cancellationToken);

        // Create Public Channel Entity Time if doesn't exist
        if (!await dao.EntityExistsAsync(KnownEntities.Time.EntityId, cancellationToken))
            await entityService.UpsertAsync(
                "public",
                KnownEntities.Time.EntityId,
                id => new Entity(EntityType.Channel, id, "Time"),
                cancellationToken);
    }
}