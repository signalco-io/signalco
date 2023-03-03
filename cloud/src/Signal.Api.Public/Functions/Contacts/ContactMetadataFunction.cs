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

namespace Signal.Api.Public.Functions.Contacts;

public class ContactMetadataFunction
{
    private readonly IFunctionAuthenticator functionAuthenticator;
    private readonly IEntityService entityService;

    public ContactMetadataFunction(
        IFunctionAuthenticator functionAuthenticator,
        IEntityService entityService)
    {
        this.functionAuthenticator = functionAuthenticator ?? throw new ArgumentNullException(nameof(functionAuthenticator));
        this.entityService = entityService ?? throw new ArgumentNullException(nameof(entityService));
    }

    [FunctionName("Contact-Metadata")]
    [OpenApiSecurityAuth0Token]
    [OpenApiOperation<ContactMetadataFunction>("Contact", Description = "Contact metadata.")]
    [OpenApiJsonRequestBody<ContactMetadataDto>]
    [OpenApiResponseWithoutBody(HttpStatusCode.OK)]
    [OpenApiResponseBadRequestValidation]
    public async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "contact/metadata")]
        HttpRequest req,
        CancellationToken cancellationToken = default) =>
        await req.UserRequest<ContactMetadataDto>(cancellationToken, this.functionAuthenticator, async context =>
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

            await this.entityService.ContactSetMetadataAsync(contactPointer, payload.Metadata, cancellationToken);
        });
}