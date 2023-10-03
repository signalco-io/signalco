using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Signal.Api.Common.Auth;
using Signal.Api.Common.Exceptions;
using Signal.Api.Common.OpenApi;
using Signal.Core.Contacts;
using Signal.Core.Entities;
using Signal.Core.Exceptions;
using Signal.Core.Secrets;
using Signal.Core.Storage;
using Signalco.Channel.Slack.Secrets;

namespace Signalco.Channel.Slack.Functions.Auth;

public class SlackOauthAccessFunction(
    ISecretsManager secrets,
    IFunctionAuthenticator authenticator,
    IEntityService entityService,
    IAzureStorage storage)
{
    [Function("Slack-Auth-OauthAccess")]
    [OpenApiOperation<SlackOauthAccessFunction>("Slack", "Auth", Description = "Creates new Slack channel.")]
    [OpenApiJsonRequestBody<OAuthAccessRequestDto>(Description = "OAuth code returned by Slack.")]
    [OpenApiOkJsonResponse(typeof(AccessResponseDto))]
    [OpenApiResponseBadRequestValidation]
    public async Task<HttpResponseData> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "auth/access")] HttpRequestData req,
        CancellationToken cancellationToken = default) =>
        await req.UserRequest<OAuthAccessRequestDto, AccessResponseDto>(cancellationToken, authenticator, async context =>
        {
            if (string.IsNullOrWhiteSpace(context.Payload.Code) ||
                string.IsNullOrWhiteSpace(context.Payload.RedirectUrl))
                throw new ExpectedHttpException(HttpStatusCode.BadRequest, "Required fields are missing");

            // Resolve access token using temporary OAuth user code
            var clientId = await secrets.GetSecretAsync(SlackSecretKeys.ClientId, cancellationToken);
            var clientSecret = await secrets.GetSecretAsync(SlackSecretKeys.ClientSecret, cancellationToken);
            using var client = new HttpClient();
            var accessResponse = await client.PostAsync(
                "https://slack.com/api/oauth.v2.access",
                new FormUrlEncodedContent(new[]
                {
                    new KeyValuePair<string, string>("code", context.Payload.Code),
                    new KeyValuePair<string, string>("redirect_uri", context.Payload.RedirectUrl),
                    new KeyValuePair<string, string>("client_id", clientId),
                    new KeyValuePair<string, string>("client_secret", clientSecret)
                }),
                cancellationToken);
            var access = await accessResponse.Content.ReadFromJsonAsync<OAuthAccessResponseDto>(cancellationToken: cancellationToken);
            if (access is not {Ok: true})
                throw new ExpectedHttpException(
                    HttpStatusCode.BadRequest,
                    $"Got not OK response from Slack: {access?.Error ?? "NO_ERROR"}, check your code and try again.");
            if (string.IsNullOrWhiteSpace(access.AccessToken))
                throw new ExpectedHttpException(
                    HttpStatusCode.BadRequest,
                    $"Slack didn't return AccessToken. Check error: {access.Error ?? "NO_ERROR"}");
            if (access.TokenType != "bot")
                throw new ExpectedHttpException(
                    HttpStatusCode.BadRequest, 
                    $"Token type not supported: {access.TokenType}");

            // Persist to KeyVault with unique ID (generated)
            var accessSecretKey = Guid.NewGuid().ToString();
            await secrets.SetAsync(accessSecretKey, access.AccessToken, cancellationToken);

            // Create channel entity
            var alias = string.Join(" - ", new[] {"Slack", access.Team?.Name}.Where(i => i != null));
            var channelId = await entityService.UpsertAsync(
                context.User.UserId,
                null,
                id => new Entity(EntityType.Channel, id, alias),
                cancellationToken);

            // Create channel contact - auth token with ID
            // TODO: Use entity service
            // TODO: Update existing slack channel if having matching already (match by team and bot user id)
            await storage.UpsertAsync(
                new Contact(
                    channelId,
                    KnownChannels.Slack,
                    KnownContacts.AccessToken,
                    accessSecretKey,
                    DateTime.UtcNow,
                    null),
                cancellationToken);

            await storage.UpsertAsync(
                new Contact(
                    channelId,
                    KnownChannels.Slack,
                    KnownContacts.BotUserId,
                    access.BotUserId,
                    DateTime.UtcNow,
                    null),
                cancellationToken);

            if (access.Team != null)
            {
                await storage.UpsertAsync(
                    new Contact(
                        channelId,
                        KnownChannels.Slack,
                        KnownContacts.Team,
                        JsonSerializer.Serialize(access.Team),
                        DateTime.UtcNow,
                        null),
                    cancellationToken);
            }

            return new AccessResponseDto(channelId);
        });

    [Serializable]
    private class OAuthAccessRequestDto
    {
        [JsonPropertyName("code")]
        public string? Code { get; set; }

        [JsonPropertyName("redirectUrl")]
        public string? RedirectUrl { get; set; }
    }

    [Serializable]
    public class OAuthAccessResponseDto
    {
        [JsonPropertyName("ok")]
        public bool Ok { get; set; }

        [JsonPropertyName("access_token")]
        public string? AccessToken { get; set; }

        [JsonPropertyName("token_type")]
        public string? TokenType { get; set; }

        [JsonPropertyName("error")]
        public string? Error { get; set; }

        [JsonPropertyName("warning")]
        public string? Warning { get; set; }

        [JsonPropertyName("bot_user_id")]
        public string? BotUserId { get; set; }

        [JsonPropertyName("team")]
        public TeamDto? Team { get; set; }

        [Serializable]
        public class TeamDto
        {
            [JsonPropertyName("id")]
            public string? Id { get; set; }

            [JsonPropertyName("name")]
            public string? Name { get; set; }
        }
    }

    [Serializable]
    private class AccessResponseDto(string id)
    {
        public string Id { get; set; } = id;
    }
}