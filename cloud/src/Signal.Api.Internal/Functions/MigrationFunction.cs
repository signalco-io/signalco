using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Azure.WebJobs;
using Signal.Core.Entities;
using Signal.Core.Storage;

namespace Signal.Api.Internal.Functions;

public class MigrationFunction
{
    private const string CronOnceAYear = "0 0 0 1 1 *";
    private readonly IEntityService entityService;
    private readonly IAzureStorageDao dao;

    public MigrationFunction(
        IEntityService entityService,
        IAzureStorageDao dao)
    {
        this.entityService = entityService ?? throw new ArgumentNullException(nameof(entityService));
        this.dao = dao ?? throw new ArgumentNullException(nameof(dao));
    }

    [FunctionName("Migration")]
    public async Task Run(
        [TimerTrigger(CronOnceAYear, RunOnStartup = true)] TimerInfo timer,
        CancellationToken cancellationToken = default)
    {
        // Create Public Channel Entity Time if doesn't exist
        if (!await this.dao.EntityExistsAsync(KnownEntities.Time.EntityId, cancellationToken))
            await this.entityService.UpsertAsync(
                "public",
                KnownEntities.Time.EntityId,
                id => new Entity(EntityType.Channel, id, "Time"),
                cancellationToken);
    }
}