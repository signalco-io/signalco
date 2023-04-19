using System;
using System.ComponentModel.DataAnnotations;
using System.Net;
using System.Text.Json.Serialization;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Signal.Api.Common.Auth;
using Signal.Api.Common.Exceptions;
using Signal.Api.Common.OpenApi;
using Signal.Core.Exceptions;

namespace Signalco.Api.Public.Functions.Station;

public class StationRefreshTokenFunction
{
    private readonly IFunctionAuthenticator functionAuthenticator;

    public StationRefreshTokenFunction(
        IFunctionAuthenticator functionAuthenticator)
    {
        this.functionAuthenticator = functionAuthenticator ?? throw new ArgumentNullException(nameof(functionAuthenticator));
    }

    [Function("Station-RefreshToken")]
    [OpenApiOperation<StationRefreshTokenFunction>("Station", Description = "Refreshes the access token.")]
    [OpenApiJsonRequestBody<StationRefreshTokenRequestDto>]
    [OpenApiOkJsonResponse<StationRefreshTokenResponseDto>]
    [OpenApiResponseBadRequestValidation]
    public async Task<HttpResponseData> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "station/refresh-token")]
        HttpRequestData req,
        CancellationToken cancellationToken = default)
    {
        return await req.AnonymousRequest<StationRefreshTokenRequestDto, StationRefreshTokenResponseDto>(cancellationToken, async (context) =>
        {
            if (string.IsNullOrWhiteSpace(context.Payload.RefreshToken))
                throw new ExpectedHttpException(HttpStatusCode.BadRequest, "Refresh token is required.");

            var token = await this.functionAuthenticator.RefreshTokenAsync(req, context.Payload.RefreshToken,
                cancellationToken);
            return new StationRefreshTokenResponseDto(token.AccessToken, token.Expire);
        });
    }

    [Serializable]
    private class StationRefreshTokenRequestDto
    {
        [Required]
        [JsonPropertyName("refreshToken")]
        public string? RefreshToken { get; set; }
    }

    [Serializable]
    private class StationRefreshTokenResponseDto
    {
        public StationRefreshTokenResponseDto(string accessToken, DateTime expire)
        {
            this.AccessToken = accessToken;
            this.Expire = expire;
        }

        [JsonPropertyName("accessToken")]
        public string AccessToken { get; }

        [JsonPropertyName("expire")]
        public DateTime Expire { get; }
    }
}