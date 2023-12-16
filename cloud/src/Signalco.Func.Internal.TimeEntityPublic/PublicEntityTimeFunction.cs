using System;
using System.Globalization;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Azure.Functions.Worker;
using Signal.Core.Entities;

namespace Signalco.Func.Internal.TimeEntityPublic;

public class PublicEntityTimeFunction(IEntityService entityService)
{
    private static readonly long RoundingAmountTicks = TimeSpan.FromMinutes(1).Ticks;
    private const string CronEveryMinute = "0 * * * * *";

    [Function("PublicEntity-Time")]
    public async Task Run(
        [TimerTrigger(CronEveryMinute)] TimerInfo timer,
        CancellationToken cancellationToken = default)
    {
        var now = DateTime.UtcNow;

        var fraction = (double) (now.Ticks % RoundingAmountTicks) / RoundingAmountTicks >= 0.5 ? 1 : 0;
        var nowRounded = new DateTime((now.Ticks / RoundingAmountTicks + fraction) * RoundingAmountTicks);

        await entityService.ContactSetAsync(
            KnownEntities.Time.Contacts.Utc.Pointer,
            nowRounded.ToString("t", DateTimeFormatInfo.InvariantInfo),
            cancellationToken: cancellationToken);
    }
}