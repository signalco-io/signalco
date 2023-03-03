using System.Net;
using System.Text.Json;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.SignalRService;
using Signal.Api.Common.Auth;
using Signal.Core.Conducts;
using Signal.Core.Entities;
using Signal.Core.Exceptions;
using Signal.Core.Extensions;
using Signal.Core.Storage;

namespace Signalco.Common.Channel;

public abstract class ConductMultipleFunctionsForwardToStationBase : ConductMultipleFunctionsBase
{
    private readonly IEntityService entityService;
    private readonly IAzureStorageDao storageDao;

    protected ConductMultipleFunctionsForwardToStationBase(
        IEntityService entityService,
        IAzureStorageDao storageDao,
        IFunctionAuthenticator authenticator,
        IAzureStorage storage) 
        : base(authenticator, storage)
    {
        this.entityService = entityService ?? throw new ArgumentNullException(nameof(entityService));
        this.storageDao = storageDao ?? throw new ArgumentNullException(nameof(storageDao));
    }

    protected async Task<IActionResult> HandleAsync(
        HttpRequest req,
        IAsyncCollector<SignalRMessage> signalRMessages,
        CancellationToken cancellationToken = default)
    {
        var usersConducts = new Dictionary<string, ICollection<ConductRequestDto>>();
        return await this.HandleAsync(req, async (conduct, context) =>
        {
            await context.ValidateUserAssignedAsync(
                this.entityService,
                conduct.EntityId ?? throw new ExpectedHttpException(HttpStatusCode.BadRequest, "EntityId is required"));

            // Retrieve all entity assigned entities
            var entityUsers = (await this.storageDao.AssignedUsersAsync(
                new[] { conduct.EntityId },
                cancellationToken)).FirstOrDefault();

            foreach (var userId in entityUsers.Value)
                usersConducts.Append(userId, conduct);
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