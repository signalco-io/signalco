using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Net;
using System.Text.Json.Serialization;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.Extensions.Logging;
using Signal.Api.Common.Auth;
using Signal.Api.Common.Exceptions;
using Signal.Api.Common.OpenApi;
using Signal.Core.Entities;
using Signal.Core.Exceptions;
using Signal.Core.Sharing;

namespace Signal.Api.Public.Functions.Sharing;

public class UnShareEntityFunction
{
    private readonly IFunctionAuthenticator functionAuthenticator;
    private readonly ISharingService sharingService;
    private readonly IEntityService entityService;
    private readonly ILogger<ShareEntityFunction> logger;

    public UnShareEntityFunction(
        IFunctionAuthenticator functionAuthenticator,
        ISharingService sharingService,
        IEntityService entityService,
        ILogger<ShareEntityFunction> logger)
    {
        this.functionAuthenticator = functionAuthenticator ?? throw new ArgumentNullException(nameof(functionAuthenticator));
        this.sharingService = sharingService ?? throw new ArgumentNullException(nameof(sharingService));
        this.entityService = entityService ?? throw new ArgumentNullException(nameof(entityService));
        this.logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    [FunctionName("UnShare-Entity")]
    [OpenApiSecurityAuth0Token]
    [OpenApiOperation(nameof(UnShareEntityFunction), "Sharing", Description = "Un-shared the entity from users.")]
    [OpenApiJsonRequestBody<UnShareRequestDto>(Description = "Un-share one entity with one or more users.")]
    [OpenApiResponseWithoutBody(HttpStatusCode.OK)]
    [OpenApiResponseBadRequestValidation]
    public async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "delete", Route = "share/entity")]
        HttpRequest req,
        CancellationToken cancellationToken = default) =>
        await req.UserRequest<UnShareRequestDto>(cancellationToken, this.functionAuthenticator,
            async context =>
            {
                if (string.IsNullOrWhiteSpace(context.Payload.EntityId))
                    throw new ExpectedHttpException(HttpStatusCode.BadRequest, "EntityId is required");
                if (context.Payload.UserEmails == null || !context.Payload.UserEmails.Any())
                    throw new ExpectedHttpException(HttpStatusCode.BadRequest, "UserEmails is required - at least one user email is required");

                await context.ValidateUserAssignedAsync(this.entityService, context.Payload.EntityId);

                foreach (var userEmail in context.Payload.UserEmails.Where(userEmail => !string.IsNullOrWhiteSpace(userEmail)))
                {
                    try
                    {
                        await this.sharingService.UnAssignFromUserEmailAsync(
                            userEmail,
                            context.Payload.EntityId,
                            cancellationToken);
                    }
                    catch (Exception ex)
                    {
                        this.logger.LogInformation(ex, "Failed to un-share entity {EntityId} with provided user {UserEmail}.", context.Payload.EntityId, userEmail);
                    }
                }
            });

    [Serializable]
    private class UnShareRequestDto
    {
        [Required]
        [JsonPropertyName("entityId")]
        public string? EntityId { get; set; }

        [Required]
        [JsonPropertyName("userEmails")]
        public List<string>? UserEmails { get; set; }
    }
}