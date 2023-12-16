using System.Collections.Concurrent;
using System.Net;
using Microsoft.Azure.Functions.Worker.Http;
using Signal.Api.Common.Auth;
using Signal.Api.Common.Exceptions;
using Signal.Core.Conducts;
using Signal.Core.Exceptions;
using Signal.Core.Processor;
using Signal.Core.Storage;

namespace Signalco.Common.Channel;

public abstract class ConductMultipleFunctionsBase(
        IFunctionAuthenticator authenticator,
        IAzureStorage storage)
    : ConductFunctionsBase
{
    protected async Task<HttpResponseData> HandleAsync(
        HttpRequestData req,
        Func<ConductRequestDto, UserOrSystemRequestContextWithPayload<List<ConductRequestDto>>, Task>? processConduct = null,
        Func<Task>? afterConducts = null,
        CancellationToken cancellationToken = default) =>
        await req.UserOrSystemRequest<List<ConductRequestDto>>(cancellationToken, authenticator,
            async context =>
            {
                var errors = new ConcurrentBag<Exception>();

                await Task.WhenAll(context.Payload.Select(conduct => this.ProcessConductAsync(processConduct, conduct, context, errors, cancellationToken)));

                try
                {
                    if (afterConducts != null)
                        await afterConducts();
                }
                catch (Exception ex)
                {
                    errors.Add(ex);
                }

                if (errors.Any())
                    throw new AggregateException("Some conducts failed to execute", errors);
            });

    private async Task ProcessConductAsync(
        Func<ConductRequestDto, UserOrSystemRequestContextWithPayload<List<ConductRequestDto>>, Task>? processConduct, 
        ConductRequestDto conduct,
        UserOrSystemRequestContextWithPayload<List<ConductRequestDto>> context, 
        ConcurrentBag<Exception> errors,
        CancellationToken cancellationToken = default)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(conduct.EntityId) ||
                string.IsNullOrWhiteSpace(conduct.ChannelName) ||
                string.IsNullOrWhiteSpace(conduct.ContactName))
                throw new ExpectedHttpException(
                    HttpStatusCode.BadRequest,
                    "EntityId, ChannelName and ContactName properties are required.");

            // TODO: Reject not supported channels
            // TODO: Verify user owns channel
            // TODO: Add support for conduct delay
            var processConductTask = Task.CompletedTask;
            if (processConduct != null)
                processConductTask = processConduct(conduct, context);

            var usageTask = storage.QueueAsync(context.User?.UserId != null
                ? new UsageQueueItem(context.User.UserId, UsageKind.Conduct)
                : null, cancellationToken);

            await Task.WhenAll(processConductTask, usageTask);
        }
        catch (Exception ex)
        {
            errors.Add(ex);
        }
    }
}