using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Extensions.OpenApi.Extensions;
using Microsoft.Azure.Functions.Worker.Http;
using Signal.Api.Common.Auth;
using Signal.Api.Common.OpenApi;
using Signal.Core.Conducts;
using Signal.Core.Notifications;
using Signal.Core.Storage;
using Signalco.Common.Channel;

namespace Signalco.Api.Public.Functions.Conducts;

public class ConductRequestMultipleFunction(
        IFunctionAuthenticator functionAuthenticator,
        IAzureStorage storage,
        INotificationService notificationService)
    : ConductMultipleFunctionsBase(functionAuthenticator, storage)
{
    [Function("Conducts-RequestMultiple")]
    [OpenApiSecurityAuth0Token]
    [OpenApiOperation<ConductRequestMultipleFunction>("Conducts", Description = "Requests multiple conducts to be executed.")]
    [OpenApiJsonRequestBody<List<ConductRequestDto>>(Description = "Collection of conducts to execute.")]
    [OpenApiResponseWithoutBody]
    [OpenApiResponseBadRequestValidation]
    public async Task<HttpResponseData> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "conducts/request-multiple")]
        HttpRequestData req,
        CancellationToken cancellationToken = default)
    {
        return await this.HandleAsync(req, async (conduct, context) =>
        {
            if (conduct.EntityId == "cloud") // TODO: Move to cloud channel
            {
                // Handle notification create conduct
                if (conduct is {ChannelName: "notification", ContactName: "create"} &&
                    !string.IsNullOrWhiteSpace(conduct.ValueSerialized))
                {
                    var createRequest =
                        JsonSerializer.Deserialize<ConductPayloadCloudNotificationCreate>(
                            conduct.ValueSerialized);
                    if (createRequest is { Title: { }, Content: { } })
                    {
                        await notificationService.CreateAsync(
                            new[] { context.User.UserId },
                            new NotificationContent(
                                createRequest.Title,
                                createRequest.Content,
                                NotificationContentType.Text),
                            new NotificationOptions(true),
                            cancellationToken);
                    }
                }
            }
            else 
            {
                // Forward to channel
                // TODO: Use HTTP Client Factory
                using var client = new HttpClient();
                client.DefaultRequestHeaders.Add("Authorization", req.Headers().Authorization[0]);
                await client.PostAsync($"https://{conduct.ChannelName}.channel.api.signalco.io/api/conducts/request-multiple",
                    new StringContent(JsonSerializer.Serialize(new List<ConductRequestDto> { conduct }),
                        Encoding.UTF8, "application/json"), cancellationToken);
            }
        }, cancellationToken: cancellationToken);
    }
}