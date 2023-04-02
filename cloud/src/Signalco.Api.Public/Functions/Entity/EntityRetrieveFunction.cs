using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Signal.Api.Common.Auth;
using Signal.Api.Common.Entities;
using Signal.Api.Common.Exceptions;
using Signal.Api.Common.OpenApi;
using Signal.Api.Common.Users;
using Signal.Core.Contacts;
using Signal.Core.Entities;
using Signal.Core.Exceptions;

namespace Signal.Api.Public.Functions.Entity;

public class EntityRetrieveFunction
{
    private readonly IFunctionAuthenticator functionAuthenticator;
    private readonly IEntityService entityService;

    public EntityRetrieveFunction(
        IFunctionAuthenticator functionAuthenticator,
        IEntityService entityService)
    {
        this.functionAuthenticator = functionAuthenticator ?? throw new ArgumentNullException(nameof(functionAuthenticator));
        this.entityService = entityService ?? throw new ArgumentNullException(nameof(entityService));
    }

    [FunctionName("Entity-Retrieve")]
    [OpenApiSecurityAuth0Token]
    [OpenApiOperation<EntityRetrieveFunction>("Entity", Description = "Retrieves all available entities.")]
    [OpenApiOkJsonResponse<IEnumerable<EntityDetailsDto>>]
    public async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "entity")]
        HttpRequest req,
        CancellationToken cancellationToken = default) =>
        await req.UserRequest(cancellationToken, this.functionAuthenticator, async context =>
            (await this.entityService.AllDetailedAsync(context.User.UserId, null, cancellationToken))
            .Select(EntityDetailsDto)
            .ToList());

    [FunctionName("Entity-Retrieve-Single")]
    [OpenApiSecurityAuth0Token]
    [OpenApiOperation("EntityRetrieveSingleFunction", "Entity", Description = "Retrieves entity.")]
    [OpenApiOkJsonResponse<EntityDetailsDto>]
    [OpenApiResponseWithoutBody(HttpStatusCode.NotFound)]
    public async Task<IActionResult> RunSingle(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "entity/{id:guid}")]
        HttpRequest req,
        string id,
        CancellationToken cancellationToken = default) =>
        await req.UserRequest(cancellationToken, this.functionAuthenticator, async context =>
            EntityDetailsDto(await this.entityService.GetDetailedAsync(context.User.UserId, id, cancellationToken)
                             ?? throw new ExpectedHttpException(HttpStatusCode.NotFound)));
    
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