using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Signal.Api.Common.Auth;
using Signal.Api.Common.OpenApi;
using Signalco.Common.Channel;
using Signal.Core.Conducts;
using Signal.Core.Storage;

namespace Signalco.Channel.Slack.Functions.Conducts;

internal class ConductRequestMultipleFunction(
        IFunctionAuthenticator authenticator,
        IAzureStorage storage,
        ISlackAccessTokenProvider slackAccessTokenProvider)
    : ConductMultipleFunctionsBase(authenticator, storage)
{
    [Function("Conducts-RequestMultiple")]
    [OpenApiSecurityAuth0Token]
    [OpenApiOperation<ConductRequestMultipleFunction>("Conducts",
        Description = "Requests multiple conducts to be executed.")]
    [OpenApiJsonRequestBody<List<ConductRequestDto>>(
        Description = "Collection of conducts to execute.")]
    [OpenApiResponseWithoutBody]
    [OpenApiResponseBadRequestValidation]
    public async Task<HttpResponseData> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "conducts/request-multiple")]
        HttpRequestData req,
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
                    JsonSerializer.Deserialize<SlackSendMessagePayloadDto>(conductRequest.ValueSerialized ?? "");

                // TODO: Use http client factory
                using var client = new HttpClient();
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(
                    "Bearer",
                    await slackAccessTokenProvider.GetAccessTokenAsync(
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
}