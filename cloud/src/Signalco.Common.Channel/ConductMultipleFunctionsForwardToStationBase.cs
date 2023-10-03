using System.Net;
using System.Text.Json;
using Microsoft.Azure.Functions.Worker.Http;
using Signal.Api.Common.Auth;
using Signal.Core.Conducts;
using Signal.Core.Entities;
using Signal.Core.Exceptions;
using Signal.Core.Extensions;
using Signal.Core.Notifications;
using Signal.Core.Storage;

namespace Signalco.Common.Channel;

public abstract class ConductMultipleFunctionsForwardToStationBase(
        IEntityService entityService,
        IAzureStorageDao storageDao,
        IFunctionAuthenticator authenticator,
        IAzureStorage storage,
        ISignalRService signalRService)
    : ConductMultipleFunctionsBase(authenticator, storage)
{
    protected async Task<HttpResponseData> HandleAsync(
        HttpRequestData req,
        CancellationToken cancellationToken = default)
    {
        var usersConducts = new Dictionary<string, ICollection<ConductRequestDto>>();
        return await this.HandleAsync(req, async (conduct, context) =>
        {
            await context.ValidateUserAssignedAsync(
                entityService,
                conduct.EntityId ?? throw new ExpectedHttpException(HttpStatusCode.BadRequest, "EntityId is required"));

            // Retrieve all entity assigned entities
            var entityUsers = (await storageDao.AssignedUsersAsync(
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
                await signalRService.SendToUsersAsync(
                    new[] {userId},
                    "conducts",
                    "requested-multiple",
                    new object[] {JsonSerializer.Serialize(conducts)},
                    cancellationToken);
            }
        }, cancellationToken);
    }
}