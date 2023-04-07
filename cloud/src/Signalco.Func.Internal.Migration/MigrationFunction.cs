using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Azure.WebJobs;
using Signal.Core.Entities;
using Signal.Core.Storage;

namespace Signalco.Func.Internal.Migration;

public class MigrationFunction
{
    private const string CronOnceAYear = "0 0 0 1 1 *";
    private readonly IEntityService entityService;
    private readonly IAzureStorageDao dao;
    private readonly IAzureStorage azureStorage;
    
    private readonly string[] tablesNames = { 
        "entities", "contacts", "contactshistory", "userassignedentity",
        "users",
        "webnewsletter",
        "contactLinks" 
    };
    private readonly string[] queueNames = {
        "contact-state-processing", "usage-processing"
    };

    public MigrationFunction(
        IEntityService entityService,
        IAzureStorageDao dao,
        IAzureStorage azureStorage)
    {
        this.entityService = entityService ?? throw new ArgumentNullException(nameof(entityService));
        this.dao = dao ?? throw new ArgumentNullException(nameof(dao));
        this.azureStorage = azureStorage ?? throw new ArgumentNullException(nameof(azureStorage));
    }

    [FunctionName("Migration")]
    public async Task Run(
        [TimerTrigger(CronOnceAYear, RunOnStartup = true)] TimerInfo timer,
        CancellationToken cancellationToken = default)
    {
        foreach (var tableName in tablesNames) 
            await this.azureStorage.EnsureTableAsync(tableName, cancellationToken);
        
        foreach (var queueName in queueNames) 
            await this.azureStorage.EnsureQueueAsync(queueName, cancellationToken);
        
        // Create Public Channel Entity Time if doesn't exist
        if (!await this.dao.EntityExistsAsync(KnownEntities.Time.EntityId, cancellationToken))
            await this.entityService.UpsertAsync(
                "public",
                KnownEntities.Time.EntityId,
                id => new Entity(EntityType.Channel, id, "Time"),
                cancellationToken);
    }
}