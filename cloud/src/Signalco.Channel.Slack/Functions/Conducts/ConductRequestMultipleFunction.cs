using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Signal.Api.Common.Auth;
using Signal.Api.Common.OpenApi;
using Signal.Core.Contacts;
using Signal.Core.Entities;
using Signal.Core.Secrets;
using Signalco.Common.Channel;
using Signal.Api.Common.Exceptions;
using Signal.Core.Conducts;
using Signal.Core.Exceptions;
using Signal.Core.Storage;

namespace Signalco.Channel.Slack.Functions.Conducts;

public class ConductRequestMultipleFunction : ConductMultipleFunctionsBase
{
    private readonly IFunctionAuthenticator authenticator;
    private readonly ISecretsProvider secrets;
    private readonly IEntityService entityService;

    public ConductRequestMultipleFunction(
        IFunctionAuthenticator authenticator,
        ISecretsProvider secrets,
        IEntityService entityService,
        IAzureStorage storage)
    : base(authenticator, storage)
    {
        this.authenticator = authenticator ?? throw new ArgumentNullException(nameof(authenticator));
        this.secrets = secrets ?? throw new ArgumentNullException(nameof(secrets));
        this.entityService = entityService ?? throw new ArgumentNullException(nameof(entityService));
    }

    [FunctionName("Conduct")]
    [OpenApiOperation(operationId: "Conduct", tags: new[] { "Conducts" })]
    public async Task<IActionResult> RunSingle(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "conduct/{entityId:guid}/{contactName}")]
        HttpRequest req,
        string entityId,
        string contactName,
        CancellationToken cancellationToken = default) =>
        await req.UserOrSystemRequest<ConductPayloadDto>(cancellationToken, this.authenticator,
            async context =>
            {
                if (string.IsNullOrWhiteSpace(entityId) ||
                    string.IsNullOrWhiteSpace(contactName))
                    throw new ExpectedHttpException(
                        HttpStatusCode.BadRequest,
                        "EntityId, ContactName properties are required.");
                
                // Execute action according to contact name
                if (contactName == "sendMessage")
                {
                    var sendMessagePayload =
                        JsonSerializer.Deserialize<SendMessagePayloadDto>(context.Payload.ValueSerialized ?? "");

                    // TODO: Use http client factory
                    using var client = new HttpClient();
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(
                        "Bearer",
                        await this.GetAccessTokenAsync(entityId, cancellationToken));
                    await client.PostAsJsonAsync("https://slack.com/api/chat.postMessage", new
                    {
                        text = sendMessagePayload?.Text,
                        channel = sendMessagePayload?.ChannelId
                    }, cancellationToken);
                }
                else
                {
                    throw new InvalidOperationException($"Unrecognized contact action: {contactName}.");
                }
            });

    [FunctionName("Conducts-RequestMultiple")]
    [OpenApiSecurityAuth0Token]
    [OpenApiOperation(nameof(ConductRequestMultipleFunction), "Conducts",
        Description = "Requests multiple conducts to be executed.")]
    [OpenApiRequestBody("application/json", typeof(List<ConductRequestDto>),
        Description = "Collection of conducts to execute.")]
    [OpenApiResponseWithoutBody(HttpStatusCode.OK)]
    [OpenApiResponseBadRequestValidation]
    public async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "conducts/request-multiple")]
        HttpRequest req,
        CancellationToken cancellationToken = default) =>
        await this.HandleAsync(req, async (conductRequest, _)=>
        {
            // Reject not supported channels
            if (conductRequest.ChannelName != KnownChannels.Slack)
                throw new Exception($"Not supported channel name {conductRequest.ChannelName}");

            // Execute action according to contact name
            if (conductRequest.ContactName == "sendMessage")
            {
                var sendMessagePayload =
                    JsonSerializer.Deserialize<SendMessagePayloadDto>(conductRequest.ValueSerialized ?? "");

                // TODO: Use http client factory
                using var client = new HttpClient();
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(
                    "Bearer",
                    await this.GetAccessTokenAsync(
                        conductRequest.EntityId ?? throw new Exception("EntityId not specified"), 
                        cancellationToken));
                await client.PostAsJsonAsync("https://slack.com/api/chat.postMessage", new
                {
                    text = sendMessagePayload?.Text,
                    channel = sendMessagePayload?.ChannelId
                }, cancellationToken);
            }
            else
            {
                throw new InvalidOperationException($"Unrecognized contact action: {conductRequest.ContactName}.");
            }
        }, null, cancellationToken);

    private async Task<string> GetAccessTokenAsync(string entityId, CancellationToken cancellationToken = default)
    {
        // TODO: SECURITY: User can retrieve any access token by changing value in contact - limit to this user keys

        var accessTokenContact = await this.entityService.ContactAsync(new ContactPointer(
                entityId,
                KnownChannels.Slack,
                KnownContacts.AccessToken),
            cancellationToken);
        if (accessTokenContact == null || string.IsNullOrWhiteSpace(accessTokenContact.ValueSerialized))
            throw new Exception($"Entity {entityId} missing access token contact or access token value.");

        var accessToken = await this.secrets.GetSecretAsync(accessTokenContact.ValueSerialized, cancellationToken);
        if (string.IsNullOrWhiteSpace(accessToken))
            throw new Exception($"Entity {entityId} assigned access token is invalid.");

        return accessToken;
    }

    [Serializable]
    private class SendMessagePayloadDto
    {
        [JsonPropertyName("text")]
        public string? Text { get; set; }

        [JsonPropertyName("channelId")]
        public string? ChannelId { get; set; }
    }
}