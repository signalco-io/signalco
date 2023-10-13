using System.Net;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using Signal.Core.Exceptions;
using Signal.Core.Processor;
using Signal.Core.Secrets;

namespace Signalco.Func.Internal.ContactStateProcessor;

public class ContactStateProcessTrigger(
    IProcessManager manager,
    ILogger<ContactStateProcessTrigger> logger)
{
    [Function("ContactStateProcessTrigger")]
    public async Task Run(
        [QueueTrigger("contact-state-processing", Connection = SecretKeys.StorageAccountConnectionString)]
        string trigger,
        CancellationToken cancellationToken = default)
    {
        var pointer = JsonSerializer.Deserialize<ContactStateProcessQueueItem>(trigger);
        if (pointer == null)
            throw new ExpectedHttpException(HttpStatusCode.BadRequest, "Invalid queue item data");

        logger.LogInformation("Dequeued pointer: {@Pointer}", pointer);

        await manager.FromQueueAsync(pointer.Pointer, cancellationToken);
    }
}