using System;
using System.Net;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Azure.WebJobs;
using Microsoft.Extensions.Logging;
using Signal.Core.Exceptions;
using Signal.Core.Processor;

namespace Signal.Api.Internal.Functions
{
    public class ContactStateProcessTrigger
    {
        private readonly IProcessManager manager;

        public ContactStateProcessTrigger(
            IProcessManager manager)
        {
            this.manager = manager ?? throw new ArgumentNullException(nameof(manager));
        }

        [FunctionName("ContactStateProcessTrigger")]
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
