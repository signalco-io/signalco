using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Signal.Api.Common.Auth;
using Signal.Api.Common.Contact;
using Signal.Api.Common.Exceptions;
using Signal.Api.Common.OpenApi;
using Signal.Core.Contacts;
using Signal.Core.Entities;
using Signal.Core.Exceptions;
using Signal.Core.Processor;
using Signal.Core.Storage;

namespace Signal.Api.Public.Functions.Contacts;

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

    [FunctionName("Contact-Set")]
    [OpenApiSecurityAuth0Token]
    [OpenApiOperation<ContactSetFunction>("Contact", Description = "Sets contact value.")]
    [OpenApiJsonRequestBody<ContactSetDto>]
    [OpenApiResponseWithoutBody(HttpStatusCode.OK)]
    [OpenApiResponseBadRequestValidation]
    public async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "contact/set")]
        HttpRequest req,
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

            var contactSetTask = this.entityService.ContactSetAsync(contactPointer, payload.ValueSerialized, payload.TimeStamp, cancellationToken);

            // TODO: Move to UsageService
            var usageTask = this.storage.QueueAsync(new UsageQueueItem(context.User.UserId, UsageKind.ContactSet), cancellationToken);

            await Task.WhenAll(
                contactSetTask,
                usageTask);
        });
}