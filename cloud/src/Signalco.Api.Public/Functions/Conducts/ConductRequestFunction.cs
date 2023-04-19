using System;
using System.Linq;
using System.Net;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Signal.Api.Common.Auth;
using Signal.Api.Common.Exceptions;
using Signal.Api.Common.OpenApi;
using Signal.Core.Conducts;
using Signal.Core.Entities;
using Signal.Core.Exceptions;
using Signal.Core.Processor;
using Signal.Core.Storage;
using Signalco.Common.Channel;

namespace Signalco.Api.Public.Functions.Conducts;

public class ConductRequestFunction : ConductFunctionsBase
{
    private readonly IFunctionAuthenticator functionAuthenticator;
    private readonly IEntityService entityService;
    private readonly IAzureStorageDao storageDao;
    private readonly IAzureStorage storage;

    public ConductRequestFunction(
        IFunctionAuthenticator functionAuthenticator,
        IEntityService entityService,
        IAzureStorageDao storageDao,
        IAzureStorage storage)
    {
        this.functionAuthenticator = functionAuthenticator ?? throw new ArgumentNullException(nameof(functionAuthenticator));
        this.entityService = entityService ?? throw new ArgumentNullException(nameof(entityService));
        this.storageDao = storageDao ?? throw new ArgumentNullException(nameof(storageDao));
        this.storage = storage ?? throw new ArgumentNullException(nameof(storage));
    }

    [Function("Conducts-Request")]
    [OpenApiSecurityAuth0Token]
    [OpenApiOperation<ConductRequestFunction>("Conducts", Description = "Requests conduct to be executed.")]
    [OpenApiJsonRequestBody<ConductRequestDto>(Description = "The conduct to execute.")]
    [OpenApiResponseWithoutBody()]
    [OpenApiResponseBadRequestValidation]
    public async Task<HttpResponseData> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "conducts/request")]
        HttpRequestData req,
        [SignalR(HubName = "conducts")] IAsyncCollector<SignalRMessage> signalRMessages,
        CancellationToken cancellationToken = default) =>
        await req.UserRequest<ConductRequestDto>(cancellationToken, this.functionAuthenticator, async context =>
        {
            var payload = context.Payload;
            if (string.IsNullOrWhiteSpace(payload.EntityId) ||
                string.IsNullOrWhiteSpace(payload.ChannelName) ||
                string.IsNullOrWhiteSpace(payload.ContactName))
                throw new ExpectedHttpException(
                    HttpStatusCode.BadRequest,
                    "EntityId, ChannelName and ContactName properties are required.");

            var authTask = context.ValidateUserAssignedAsync(this.entityService, payload.EntityId);
            var entityUsersTask = this.storageDao.AssignedUsersAsync(
                new[] {payload.EntityId },
                cancellationToken);
            var usageTask = this.storage.QueueAsync(new UsageQueueItem(context.User.UserId, UsageKind.Conduct), cancellationToken);

            await Task.WhenAll(authTask, entityUsersTask, usageTask);

            // Send to all users of the entity
            foreach (var entityUserId in entityUsersTask.Result.First().Value)
            {
                await signalRMessages.AddAsync(
                    new SignalRMessage
                    {
                        Target = "requested",
                        Arguments = new object[] {JsonSerializer.Serialize(payload)},
                        UserId = entityUserId
                    }, cancellationToken);
            }

            // TODO: Queue conduct on remote in case client doesn't receive signalR message
        });
}