using System.Text.Json;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Signal.Api.Common.Auth;
using Signal.Api.Common.Exceptions;
using Signal.Core.Conducts;
using Signal.Core.Entities;

namespace Signalco.Common.Channel;

public abstract class ConductFunctionsForwardToStationBase : ConductFunctionsBase
{
    private readonly IEntityService entityService;
    private readonly IFunctionAuthenticator authenticator;

    protected ConductFunctionsForwardToStationBase(
        IEntityService entityService,
        IFunctionAuthenticator authenticator)
    {
        this.entityService = entityService ?? throw new ArgumentNullException(nameof(entityService));
        this.authenticator = authenticator ?? throw new ArgumentNullException(nameof(authenticator));
    }

    protected async Task<IActionResult> HandleAsync(
        HttpRequest req,
        string channelName,
        string entityId,
        string contactName,
        CancellationToken cancellationToken = default) =>
        await req.UserOrSystemRequest<ConductPayloadDto>(
            cancellationToken,
            this.authenticator,
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

        await this.entityService.BroadcastToEntityUsersAsync(
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