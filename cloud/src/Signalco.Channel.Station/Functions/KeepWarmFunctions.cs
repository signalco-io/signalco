using System;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;

namespace Signalco.Channel.Station.Functions;

public class KeepWarmFunctions
{
    [Function("KeepWarm")]
    public void Run([TimerTrigger("0 */3 * * * *")] TimerInfo myTimer, FunctionContext context)
    {
        var logger = context.GetLogger<KeepWarmFunctions>();
        logger.LogInformation("C# Timer trigger function executed at: {0}", DateTime.Now);
    }
}