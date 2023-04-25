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
        private readonly ILogger<ContactStateProcessTrigger> logger;

        public ContactStateProcessTrigger(
            IProcessManager manager,
            ILogger<ContactStateProcessTrigger> logger)
        {
            this.manager = manager ?? throw new ArgumentNullException(nameof(manager));
            this.logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        [Function("ContactStateProcessTrigger")]
        public async Task Run(
            [QueueTrigger("contact-state-processing", Connection = "SignalcoStorageAccountConnectionString")]
            string trigger,
            CancellationToken cancellationToken = default)
        {
            var pointer = JsonSerializer.Deserialize<ContactStateProcessQueueItem>(trigger);
            if (pointer == null)
                throw new ExpectedHttpException(HttpStatusCode.BadRequest, "Invalid queue item data");

            this.logger.LogInformation("Dequeued pointer: {@Pointer}", pointer);

            await this.manager.FromQueueAsync(pointer.Pointer, cancellationToken);
        }
    }
}
