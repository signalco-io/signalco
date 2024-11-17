using System;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.OpenApi.Models;
using Signal.Api.Common.Auth;
using Signal.Api.Common.Entities;
using Signal.Api.Common.Exceptions;
using Signal.Api.Common.OpenApi;
using Signal.Api.Common.Users;
using Signal.Core.Contacts;
using Signal.Core.Entities;
using Signal.Core.Exceptions;

namespace Signalco.Api.Public.Functions.Entity;

public class EntityRetrieveSingleFunction(
    IFunctionAuthenticator functionAuthenticator,
    IEntityService entityService)
{
    [Function("Entities-Retrieve-Single")]
    [OpenApiSecurityAuth0Token]
    [OpenApiOperation<EntityRetrieveSingleFunction>("Entities", Description = "Retrieves single entity.")]
    [OpenApiParameter("id", In = ParameterLocation.Path, Required = true, Type = typeof(Guid), Description = "Entity identifier")]
    [OpenApiOkJsonResponse<EntityDetailsDto>]
    [OpenApiResponseWithoutBody(HttpStatusCode.NotFound)]
    public async Task<HttpResponseData> RunSingle(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "entity/{id:guid}")]
        HttpRequestData req,
        string? id,
        CancellationToken cancellationToken = default) =>
        await req.UserRequest(cancellationToken, functionAuthenticator, async context =>
        {
            if (string.IsNullOrWhiteSpace(id))
                throw new ExpectedHttpException(HttpStatusCode.BadRequest, "Id property is required.");

            return EntityDetailsDto(
                await entityService.GetDetailedAsync(context.User.UserId, id, cancellationToken)
                ?? throw new ExpectedHttpException(HttpStatusCode.NotFound));
        });
    
    // TODO: Use mapper
    private static EntityDetailsDto EntityDetailsDto(IEntityDetailed entity) =>
        new(entity.Type, entity.Id, entity.Alias)
        {
            Contacts = entity.Contacts
                .Select(s => new ContactDto
                (
                    s.EntityId,
                    s.ContactName,
                    s.ChannelName,
                    s.ValueSerialized,
                    s.TimeStamp,
                    s.Metadata
                )),
            SharedWith = entity.Users
                .Select(u => new UserDto(u.UserId, u.Email, u.FullName))
        };
}