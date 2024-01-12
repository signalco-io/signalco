using System;
using System.Text.Json.Serialization;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Signal.Api.Common.Auth;
using Signal.Api.Common.Exceptions;
using Signal.Api.Common.OpenApi;
using Signal.Core.Auth;

namespace Signalco.Api.Public.Functions.Auth;

public class PatsCreateFunction(
    IFunctionAuthenticator functionAuthenticator,
    IPatService patService)
{
    [Function("Auth-Pats-Create")]
    [OpenApiSecurityAuth0Token]
    [OpenApiOperation<PatsCreateFunction>("Auth", Description = "Creates new PAT.")]
    [OpenApiJsonRequestBody<PatCreateDto>]
    [OpenApiOkJsonResponse<PatCreateResponseDto>]
    public async Task<HttpResponseData> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "auth/pats")]
        HttpRequestData req,
        CancellationToken cancellationToken = default) =>
        await req.UserRequest<PatCreateDto, PatCreateResponseDto>(cancellationToken, functionAuthenticator, async context =>
        {
            var payload = context.Payload;
            var user = context.User;

            var pat = await patService.CreateAsync(
                new PatCreate(user.UserId, payload.Alias, payload.Expire),
                cancellationToken);

            return new PatCreateResponseDto { Pat = pat };
        });

    [Serializable]
    private class PatCreateDto
    {
        [JsonPropertyName("alias")]
        public string? Alias { get; set; }

        [JsonPropertyName("expire")]
        public DateTime? Expire { get; set; }
    }

    [Serializable]
    private record PatCreateResponseDto
    {
        [JsonPropertyName("pat")]
        public string Pat { get; set; }
    }
}