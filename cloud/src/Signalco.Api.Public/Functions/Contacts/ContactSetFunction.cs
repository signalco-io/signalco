using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Signal.Api.Common.Auth;
using Signal.Api.Common.Contact;
using Signal.Api.Common.Exceptions;
using Signal.Api.Common.OpenApi;
using Signal.Core.Contacts;
using Signal.Core.Entities;
using Signal.Core.Exceptions;
using Signal.Core.Processor;
using Signal.Core.Storage;

namespace Signalco.Api.Public.Functions.Contacts;

public class ContactSetFunction
{
    private readonly IFunctionAuthenticator functionAuthenticator;
    private readonly IEntityService entityService;
    private readonly IAzureStorage storage;

    public ContactSetFunction(
        IFunctionAuthenticator functionAuthenticator,
        IEntityService entityService,
        IAzureStorage storage)
    {
        this.functionAuthenticator = functionAuthenticator ?? throw new ArgumentNullException(nameof(functionAuthenticator));
        this.entityService = entityService ?? throw new ArgumentNullException(nameof(entityService));
        this.storage = storage ?? throw new ArgumentNullException(nameof(storage));
    }

    [Function("Contact-Set")]
    [OpenApiSecurityAuth0Token]
    [OpenApiOperation<ContactSetFunction>("Contact", Description = "Sets contact value.")]
    [OpenApiJsonRequestBody<ContactSetDto>]
    [OpenApiResponseWithoutBody]
    [OpenApiResponseBadRequestValidation]
    public async Task<HttpResponseData> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "contact/set")]
        HttpRequestData req,
        CancellationToken cancellationToken = default) =>
        await req.UserRequest<ContactSetDto>(cancellationToken, this.functionAuthenticator, async context =>
        {
            var payload = context.Payload;
            if (string.IsNullOrWhiteSpace(payload.ChannelName) ||
                string.IsNullOrWhiteSpace(payload.ContactName) ||
                string.IsNullOrWhiteSpace(payload.EntityId))
                throw new ExpectedHttpException(
                    HttpStatusCode.BadRequest,
                    "EntityId, ChannelName and ContactName properties are required.");

            await context.ValidateUserAssignedAsync(this.entityService, payload.EntityId);

            var contactPointer = new ContactPointer(
                payload.EntityId ?? throw new ArgumentException("Contact pointer requires entity identifier"),
                payload.ChannelName ?? throw new ArgumentException("Contact pointer requires channel name"),
                payload.ContactName ?? throw new ArgumentException("Contact pointer requires contact name"));

            await this.ContactSetAsync(context.User.UserId, contactPointer, payload.ValueSerialized, payload.TimeStamp, cancellationToken);
        });

    [Function("Entity-Contact-Set")]
    [OpenApiSecurityAuth0Token]
    [Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes.OpenApiOperation("EntityContactSet", "Entity", Description = "Sets contact value.")]
    [OpenApiJsonRequestBody<ContactSetDto>]
    [OpenApiResponseWithoutBody]
    [OpenApiResponseBadRequestValidation]
    public async Task<HttpResponseData> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "put", "post", Route = "entity/{id:guid}/contacts/{channelName}/{contactName}")]
        HttpRequestData req,
        string id,
        string channelName,
        string contactName,
        CancellationToken cancellationToken = default) =>
        await req.UserRequest<EntityContactSetDto>(cancellationToken, this.functionAuthenticator, async context =>
        {
            if (string.IsNullOrWhiteSpace(channelName) ||
                string.IsNullOrWhiteSpace(contactName) ||
                string.IsNullOrWhiteSpace(id))
                throw new ExpectedHttpException(
                    HttpStatusCode.BadRequest,
                    "EntityId, ChannelName and ContactName parameters are required.");

            await context.ValidateUserAssignedAsync(this.entityService, id);

            var contactPointer = new ContactPointer(
                id ?? throw new ArgumentException("Contact pointer requires entity identifier"),
                channelName ?? throw new ArgumentException("Contact pointer requires channel name"),
                contactName ?? throw new ArgumentException("Contact pointer requires contact name"));

            await this.ContactSetAsync(context.User.UserId, contactPointer, context.Payload.ValueSerialized, context.Payload.TimeStamp, cancellationToken);
        });

    private async Task ContactSetAsync(
        string userId,
        IContactPointer contactPointer, 
        string? valueSerialized,
        DateTime? timeStamp,
        CancellationToken cancellationToken = default)
    {
        var contactSetTask = this.entityService.ContactSetAsync(contactPointer, valueSerialized, timeStamp, cancellationToken);

        // TODO: Move to UsageService
        var usageTask = this.storage.QueueAsync(new UsageQueueItem(userId, UsageKind.ContactSet), cancellationToken);

        await Task.WhenAll(
            contactSetTask,
            usageTask);
    }
}