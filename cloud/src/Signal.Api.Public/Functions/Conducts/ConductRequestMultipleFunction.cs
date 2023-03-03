using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.Azure.WebJobs.Extensions.SignalRService;
using Signal.Api.Common.Auth;
using Signal.Api.Common.OpenApi;
using Signal.Core.Conducts;
using Signal.Core.Entities;
using Signal.Core.Exceptions;
using Signal.Core.Extensions;
using Signal.Core.Notifications;
using Signal.Core.Storage;
using Signalco.Common.Channel;

namespace Signal.Api.Public.Functions.Conducts;

public class ConductRequestMultipleFunction : ConductMultipleFunctionsBase
{
    private readonly IEntityService entityService;
    private readonly IAzureStorageDao storageDao;
    private readonly INotificationService notificationService;

    public ConductRequestMultipleFunction(
        IFunctionAuthenticator functionAuthenticator,
        IEntityService entityService,
        IAzureStorageDao storageDao,
        IAzureStorage storage,
        INotificationService notificationService)
        : base(functionAuthenticator, storage)
    {
        this.entityService = entityService ?? throw new ArgumentNullException(nameof(entityService));
        this.storageDao = storageDao ?? throw new ArgumentNullException(nameof(storageDao));
        this.notificationService = notificationService ?? throw new ArgumentNullException(nameof(notificationService));
    }

    [FunctionName("Conducts-RequestMultiple")]
    [OpenApiSecurityAuth0Token]
    [OpenApiOperation(nameof(ConductRequestMultipleFunction), "Conducts", Description = "Requests multiple conducts to be executed.")]
    [OpenApiRequestBody("application/json", typeof(List<ConductRequestDto>), Description = "Collection of conducts to execute.")]
    [OpenApiResponseWithoutBody(HttpStatusCode.OK)]
    [OpenApiResponseBadRequestValidation]
    public async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "conducts/request-multiple")]
        HttpRequest req,
        [SignalR(HubName = "conducts")] IAsyncCollector<SignalRMessage> signalRMessages,
        CancellationToken cancellationToken = default)
    {
        var usersConducts = new ConcurrentDictionary<string, ICollection<ConductRequestDto>>();
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
                        await this.notificationService.CreateAsync(
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
            else if (conduct.ChannelName == "station")
            {
                // Forward to stations
                var authTask = context.ValidateUserAssignedAsync(
                    this.entityService, 
                    conduct.EntityId ?? throw new ExpectedHttpException(HttpStatusCode.BadRequest, "EntityId is required"));
                var entityUsersTask = this.storageDao.AssignedUsersAsync(
                    new[] { conduct.EntityId },
                    cancellationToken);

                await Task.WhenAll(authTask, entityUsersTask);

                foreach (var userId in entityUsersTask.Result.First().Value)
                    usersConducts.Append(userId, conduct);
            }
            else 
            {
                // Forward to channel
                // TODO: Use HTTP Client Factory
                using var client = new HttpClient();
                client.DefaultRequestHeaders.Add("Authorization", req.Headers.Authorization[0]);
                await client.PostAsync($"https://{conduct.ChannelName}.channel.api.signalco.io/api/conducts/request-multiple",
                    new StringContent(JsonSerializer.Serialize(new List<ConductRequestDto> { conduct }),
                        Encoding.UTF8, "application/json"), cancellationToken);
            }
        }, async () =>
        {
            // TODO: Queue conduct on remote in case client doesn't receive signalR message

            // Send to all users of the entity
            foreach (var userId in usersConducts.Keys)
            {
                var conducts = usersConducts[userId];
                await signalRMessages.AddAsync(
                    new SignalRMessage
                    {
                        Target = "requested-multiple",
                        Arguments = new object[] { JsonSerializer.Serialize(conducts) },
                        UserId = userId
                    }, cancellationToken);
            }
        }, cancellationToken);
    }
}