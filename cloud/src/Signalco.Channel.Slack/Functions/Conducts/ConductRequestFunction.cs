using System;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Signal.Api.Common.Auth;
using Signal.Api.Common.Exceptions;
using Signal.Api.Common.OpenApi;
using Signal.Core.Exceptions;
using Signalco.Common.Channel;

namespace Signalco.Channel.Slack.Functions.Conducts;

internal class ConductRequestFunction(
        IFunctionAuthenticator authenticator,
        ISlackAccessTokenProvider slackAccessTokenProvider)
    : ConductFunctionsBase
{
    [Function("Conduct")]
    [OpenApiOperation<ConductRequestFunction>("Conducts")]
    public async Task<HttpResponseData> RunSingle(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "conduct/{entityId:guid}/{contactName}")]
        HttpRequestData req,
        string entityId,
        string contactName,
        CancellationToken cancellationToken = default) =>
        await req.UserOrSystemRequest<ConductPayloadDto>(cancellationToken, authenticator,
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
                        JsonSerializer.Deserialize<SlackSendMessagePayloadDto>(context.Payload.ValueSerialized ?? "");

                    // TODO: Use http client factory
                    using var client = new HttpClient();
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(
                        "Bearer",
                        await slackAccessTokenProvider.GetAccessTokenAsync(entityId, cancellationToken));
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
}