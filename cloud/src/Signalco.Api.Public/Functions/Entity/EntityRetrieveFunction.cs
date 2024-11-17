using System;
using System.Collections.Generic;
using System.Linq;
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

namespace Signalco.Api.Public.Functions.Entity;

public class EntityRetrieveFunction(
    IFunctionAuthenticator functionAuthenticator,
    IEntityService entityService)
{
    // TODO: Add OpenApi deprecated attribute
    [Function("Entity-Retrieve")]
    [OpenApiSecurityAuth0Token]
    [OpenApiOperation<EntityRetrieveFunction>("Entity", Description = "Retrieves all available entities.")]
    [OpenApiOkJsonResponse<IEnumerable<EntityDetailsDto>>]
    [Obsolete("Use the 'Entities-Retrieve' function instead.")]
    public async Task<HttpResponseData> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "entity")]
        HttpRequestData req,
        CancellationToken cancellationToken = default) =>
        await req.UserRequest(cancellationToken, functionAuthenticator, async context =>
            (await entityService.AllDetailedAsync(context.User.UserId, null, cancellationToken))
            .Select(EntityDetailsDto)
            .ToList());

    [Function("Entities-Retrieve")]
    [OpenApiSecurityAuth0Token]
    [OpenApiOperation<EntityRetrieveFunction>("Entities", Description = "Retrieves entities.")]
    [OpenApiParameter("types", In = ParameterLocation.Query, Required = false, Type = typeof(EntityType[]), Description = "Types of entities to retrieve.")]
    [OpenApiOkJsonResponse<IEnumerable<EntityDetailsDto>>]
    public async Task<HttpResponseData> RunGet(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "entities")]
        HttpRequestData req,
        CancellationToken cancellationToken = default) =>
        await req.UserRequest(cancellationToken, functionAuthenticator, async context =>
            (await entityService.AllDetailedAsync(
                context.User.UserId, 
                req.Query.GetValues("types")?.Select(Enum.Parse<EntityType>), 
                cancellationToken))
            .Select(EntityDetailsDto)
            .ToList());

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