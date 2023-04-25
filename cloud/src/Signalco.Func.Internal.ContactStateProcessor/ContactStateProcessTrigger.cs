using System;
using System.Net;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using Signal.Core.Exceptions;
using Signal.Core.Processor;

namespace Signalco.Func.Internal.ContactStateProcessor
{
    public class ContactStateProcessTrigger
    {
        private readonly IProcessManager manager;

        public ContactStateProcessTrigger(
            IProcessManager manager)
        {
            this.manager = manager ?? throw new ArgumentNullException(nameof(manager));
        }

        [Function("ContactStateProcessTrigger")]
        public async Task Run(
            [QueueTrigger("contact-state-processing", Connection = "SignalcoStorageAccountConnectionString")]
            string trigger,
            ILogger logger,
            CancellationToken cancellationToken = default)
        {
            var pointer = JsonSerializer.Deserialize<ContactStateProcessQueueItem>(trigger);
            if (pointer == null)
                throw new ExpectedHttpException(HttpStatusCode.BadRequest, "Invalid queue item data");

            logger.LogInformation("Dequeued pointer: {@Pointer}", pointer);

            await this.manager.FromQueueAsync(pointer.Pointer, cancellationToken);
        }
    }
}
