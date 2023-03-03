using System;
using System.Globalization;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Azure.WebJobs;
using Signal.Core.Entities;

namespace Signal.Api.Internal.Functions;

public class PublicEntityTimeFunction
{
    private const string CronEveryMinute = "0 * * * * *";
    private readonly IEntityService entityService;
    
    public PublicEntityTimeFunction(
        IEntityService entityService)
    {
        this.entityService = entityService ?? throw new ArgumentNullException(nameof(entityService));
    }

    [FunctionName("PublicEntity-Time")]
    public async Task Run(
        [TimerTrigger(CronEveryMinute)] TimerInfo timer,
        CancellationToken cancellationToken = default)
    {
        var now = DateTime.UtcNow;
        await this.entityService.ContactSetAsync(
            KnownEntities.Time.Contacts.Utc.Pointer,
            DateTime.UtcNow.ToString("t", DateTimeFormatInfo.InvariantInfo),
            now,
            cancellationToken);
    }
}