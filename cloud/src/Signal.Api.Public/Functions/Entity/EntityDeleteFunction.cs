using System;
using System.ComponentModel.DataAnnotations;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Signal.Api.Common.Auth;
using Signal.Api.Common.Exceptions;
using Signal.Api.Common.OpenApi;
using Signal.Core.Entities;
using Signal.Core.Exceptions;

namespace Signal.Api.Public.Functions.Entity;

public class EntityDeleteFunction
{
    private readonly IFunctionAuthenticator functionAuthenticator;
    private readonly IEntityService entityService;

    public EntityDeleteFunction(
        IFunctionAuthenticator functionAuthenticator,
        IEntityService entityService)
    {
        this.functionAuthenticator = functionAuthenticator ?? throw new ArgumentNullException(nameof(functionAuthenticator));
        this.entityService = entityService ?? throw new ArgumentNullException(nameof(entityService));
    }

    [FunctionName("Entity-Delete")]
    [OpenApiSecurityAuth0Token]
    [OpenApiOperation<EntityDeleteFunction>("Entity", Description = "Deletes the entity.")]
    [OpenApiJsonRequestBody<EntityDeleteDto>(Description = "Information about entity to delete.")]
    [OpenApiResponseWithoutBody(HttpStatusCode.OK)]
    [OpenApiResponseBadRequestValidation]
    [OpenApiResponseWithoutBody(HttpStatusCode.NotFound)]
    public async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "delete", Route = "entity")]
        HttpRequest req,
        CancellationToken cancellationToken = default) =>
        await req.UserRequest<EntityDeleteDto>(cancellationToken, this.functionAuthenticator, async context =>
        {
            if (string.IsNullOrWhiteSpace(context.Payload.Id))
                throw new ExpectedHttpException(HttpStatusCode.BadRequest, "Id property is required.");

            await this.entityService.RemoveAsync(
                context.User.UserId,
                context.Payload.Id,
                cancellationToken);
        });

    [Serializable]
    private class EntityDeleteDto
    {
        [Required]
        public string? Id { get; set; }
    }
}