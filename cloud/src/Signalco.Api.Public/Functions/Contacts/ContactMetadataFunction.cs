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

namespace Signalco.Api.Public.Functions.Contacts;

public class ContactMetadataFunction(
    IFunctionAuthenticator functionAuthenticator,
    IEntityService entityService)
{
    [Function("Contact-Metadata")]
    [OpenApiSecurityAuth0Token]
    [OpenApiOperation<ContactMetadataFunction>("Contact", Description = "Contact metadata.")]
    [OpenApiJsonRequestBody<ContactMetadataDto>]
    [OpenApiResponseWithoutBody(HttpStatusCode.OK)]
    [OpenApiResponseBadRequestValidation]
    public async Task<HttpResponseData> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "contact/metadata")]
        HttpRequestData req,
        CancellationToken cancellationToken = default) =>
        await req.UserRequest<ContactMetadataDto>(cancellationToken, functionAuthenticator, async context =>
        {
            var payload = context.Payload;
            if (string.IsNullOrWhiteSpace(payload.ChannelName) ||
                string.IsNullOrWhiteSpace(payload.ContactName) ||
                string.IsNullOrWhiteSpace(payload.EntityId))
                throw new ExpectedHttpException(
                    HttpStatusCode.BadRequest,
                    "EntityId, ChannelName and ContactName properties are required.");

            await context.ValidateUserAssignedAsync(entityService, payload.EntityId);

            var contactPointer = new ContactPointer(
                payload.EntityId ?? throw new ArgumentException("Contact pointer requires entity identifier"),
                payload.ChannelName ?? throw new ArgumentException("Contact pointer requires channel name"),
                payload.ContactName ?? throw new ArgumentException("Contact pointer requires contact name"));

            await entityService.ContactSetMetadataAsync(contactPointer, payload.Metadata, cancellationToken);
        });
}