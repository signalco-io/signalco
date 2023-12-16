using System;
using System.Linq;
using System.Net;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Signal.Api.Common.Auth;
using Signal.Api.Common.Exceptions;
using Signal.Api.Common.OpenApi;
using Signal.Core.Conducts;
using Signal.Core.Entities;
using Signal.Core.Exceptions;
using Signal.Core.Notifications;
using Signal.Core.Processor;
using Signal.Core.Storage;
using Signalco.Common.Channel;

namespace Signalco.Api.Public.Functions.Conducts;

public class ConductRequestFunction(
        IFunctionAuthenticator functionAuthenticator,
        IEntityService entityService,
        IAzureStorageDao storageDao,
        IAzureStorage storage,
        ISignalRService signalRService)
    : ConductFunctionsBase
{
    [Function("Conducts-Request")]
    [OpenApiSecurityAuth0Token]
    [OpenApiOperation<ConductRequestFunction>("Conducts", Description = "Requests conduct to be executed.")]
    [OpenApiJsonRequestBody<ConductRequestDto>(Description = "The conduct to execute.")]
    [OpenApiResponseWithoutBody()]
    [OpenApiResponseBadRequestValidation]
    public async Task<HttpResponseData> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "conducts/request")]
        HttpRequestData req,
        CancellationToken cancellationToken = default) =>
        await req.UserRequest<ConductRequestDto>(cancellationToken, functionAuthenticator, async context =>
        {
            var payload = context.Payload;
            if (string.IsNullOrWhiteSpace(payload.EntityId) ||
                string.IsNullOrWhiteSpace(payload.ChannelName) ||
                string.IsNullOrWhiteSpace(payload.ContactName))
                throw new ExpectedHttpException(
                    HttpStatusCode.BadRequest,
                    "EntityId, ChannelName and ContactName properties are required.");

            var authTask = context.ValidateUserAssignedAsync(entityService, payload.EntityId);
            var entityUsersTask = storageDao.AssignedUsersAsync(
                new[] {payload.EntityId },
                cancellationToken);
            var usageTask = storage.QueueAsync(new UsageQueueItem(context.User.UserId, UsageKind.Conduct), cancellationToken);

            await Task.WhenAll(authTask, entityUsersTask, usageTask);

            await signalRService.SendToUsersAsync(
                entityUsersTask.Result.First().Value.ToList(),
                "conducts", 
                "requested",
                new object[] {JsonSerializer.Serialize(payload)},
                cancellationToken);
            
            // TODO: Queue conduct on remote in case client doesn't receive signalR message
        });
}