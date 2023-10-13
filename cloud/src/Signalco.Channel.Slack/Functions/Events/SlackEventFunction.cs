using System;
using System.Net;
using System.Text.Json.Serialization;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using Signal.Api.Common.Exceptions;
using Signal.Api.Common.OpenApi;

namespace Signalco.Channel.Slack.Functions.Events;

public class SlackEventFunction(
    ISlackRequestHandler slackRequestHandler,
    ILogger<SlackEventFunction> logger)
{
    [Function("Slack-Event")]
    [OpenApiOperation<SlackEventFunction>( "Slack", "Event", Description = "Handles the slack event (slack > signalco web-hook call).")]
    [OpenApiJsonRequestBody<EventRequestDto>(Description = "Base model that provides content type information.")]
    [OpenApiResponseWithoutBody]
    [OpenApiResponseBadRequestValidation]
    public async Task<HttpResponseData> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "hooks/event")] HttpRequestData req,
        CancellationToken cancellationToken = default)
    {
        await slackRequestHandler.VerifyFromSlack(req, cancellationToken);

        var eventReq = await req.ReadAsJsonAsync<EventRequestDto>();
        switch (eventReq.Type)
        {
            case "url_verification":
                var verifyRequest = await req.ReadAsJsonAsync<EventUrlVerificationRequestDto>();
                return await req.JsonResponseAsync(new
                {
                    challenge = verifyRequest.Challenge
                }, cancellationToken: cancellationToken);
            case "event_callback":
                // var content = await req.ReadAsStringAsync();
                // var target = JsonSerializer.Deserialize<EventMessageChannelsRequestDto>(content);
                // TODO: Retrieve channel entity with slack-team contact that matches EntityId-slack-team.id
                // TODO: Update channel message contact
                return req.CreateResponse(HttpStatusCode.BadRequest);
            default:
                logger.LogWarning("Unknown event request type {Type}", eventReq.Type);
                return req.CreateResponse(HttpStatusCode.BadRequest);
        }
    }

    [Serializable]
    private class EventRequestDto
    {
        public string? Type { get; set; }
    }

    [Serializable]
    private class EventUrlVerificationRequestDto : EventRequestDto
    {
        public string? Challenge { get; set; }
    }

    private class EventMessageChannelsRequestDto : EventRequestDto
    {
        [JsonPropertyName("team_id")]
        public string? TeamId { get; set; }
    }
}