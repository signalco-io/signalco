using System;
using System.ComponentModel.DataAnnotations;
using System.Net;
using System.Text.Json.Serialization;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Signal.Api.Common.Auth;
using Signal.Api.Common.Exceptions;
using Signal.Api.Common.OpenApi;
using Signal.Core.Entities;
using Signal.Core.Exceptions;

namespace Signalco.Api.Public.Functions.Entity;

public class EntityUpsertFunction(
    IFunctionAuthenticator functionAuthenticator,
    IEntityService entityService)
{
    [Function("Entity-Upsert")]
    [OpenApiSecurityAuth0Token]
    [OpenApiOperation<EntityUpsertFunction>("Entity", Description = "Creates or updates entity. Will create entity if Id is not provided.")]
    [OpenApiJsonRequestBody<EntityUpsertDto>]
    [OpenApiOkJsonResponse<EntityUpsertResponseDto>]
    public async Task<HttpResponseData> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", "put", Route = "entity")]
        HttpRequestData req,
        CancellationToken cancellationToken = default) =>
        await req.UserRequest<EntityUpsertDto, EntityUpsertResponseDto>(cancellationToken, functionAuthenticator, async context =>
        {
            var payload = context.Payload;
            var user = context.User;
            if (string.IsNullOrWhiteSpace(payload.Alias))
                throw new ExpectedHttpException(HttpStatusCode.BadRequest, "Alias property is required.");
            if (payload.Type is null or EntityType.Unknown)
                throw new ExpectedHttpException(HttpStatusCode.BadRequest, "Type property is required and can't be Unknown.");

            var entityId = await entityService.UpsertAsync(
                user.UserId,
                payload.Id,
                id => new Signal.Core.Entities.Entity(
                    payload.Type.Value,
                    id,
                    payload.Alias),
                cancellationToken);

            return new EntityUpsertResponseDto(entityId);
        });

    [Serializable]
    private class EntityUpsertDto
    {
        [JsonPropertyName("id")]
        public string? Id { get; set; }

        [Required]
        [JsonPropertyName("type")]
        public EntityType? Type { get; set; }

        [Required]
        [JsonPropertyName("alias")]
        public string? Alias { get; set; }
    }

    [Serializable]
    private class EntityUpsertResponseDto(string id)
    {
        [JsonPropertyName("id")]
        public string Id { get; } = id;
    }
}