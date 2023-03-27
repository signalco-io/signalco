using System;
using System.Globalization;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Azure.WebJobs;
using Signal.Core.Entities;

namespace Signalco.Func.Internal.TimeEntityPublic;

public class PublicEntityTimeFunction
{
    private static readonly long RoundingAmountTicks = TimeSpan.FromMinutes(1).Ticks;
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

        var fraction = (double) (now.Ticks % RoundingAmountTicks) / RoundingAmountTicks >= 0.5 ? 1 : 0;
        var nowRounded = new DateTime((now.Ticks / RoundingAmountTicks + fraction) * RoundingAmountTicks);

        await this.entityService.ContactSetAsync(
            KnownEntities.Time.Contacts.Utc.Pointer,
            nowRounded.ToString("t", DateTimeFormatInfo.InvariantInfo),
            cancellationToken: cancellationToken);
    }
}