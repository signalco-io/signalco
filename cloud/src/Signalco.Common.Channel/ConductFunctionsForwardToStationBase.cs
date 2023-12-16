using System.Text.Json;
using Microsoft.Azure.Functions.Worker.Http;
using Signal.Api.Common.Auth;
using Signal.Api.Common.Exceptions;
using Signal.Core.Conducts;
using Signal.Core.Entities;

namespace Signalco.Common.Channel;

public abstract class ConductFunctionsForwardToStationBase(
        IEntityService entityService,
        IFunctionAuthenticator authenticator)
    : ConductFunctionsBase
{
    protected async Task<HttpResponseData> HandleAsync(
        HttpRequestData req,
        string channelName,
        string entityId,
        string contactName,
        CancellationToken cancellationToken = default) =>
        await req.UserOrSystemRequest<ConductPayloadDto>(
            cancellationToken,
            authenticator,
            async context =>
                await this.BroadcastConductToUsersAsync(
                    channelName,
                    entityId,
                    contactName,
                    context,
                    cancellationToken));

    private async Task BroadcastConductToUsersAsync(
        string channelName,
        string entityId,
        string contactName,
        UserOrSystemRequestContextWithPayload<ConductPayloadDto> context,
        CancellationToken cancellationToken = default)
    {
        // TODO: Retrieve user channel with matching id to read settings
        // TODO: Verify user owns entity

        await entityService.BroadcastToEntityUsersAsync(
            entityId,
            "conducts",
            "requested",
            new object[]
            {
                JsonSerializer.Serialize(new ConductRequestDto
                {
                    ChannelName = channelName,
                    ContactName = contactName,
                    EntityId = entityId,
                    ValueSerialized = context.Payload.ValueSerialized
                })
            },
            cancellationToken);
    }
}