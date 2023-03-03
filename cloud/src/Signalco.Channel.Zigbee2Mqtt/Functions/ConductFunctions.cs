using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Signal.Api.Common.Auth;
using Signal.Core.Entities;
using Signalco.Common.Channel;

namespace Signalco.Channel.Zigbee2Mqtt.Functions;

public class ConductFunctions : ConductFunctionsForwardToStationBase
{
    public ConductFunctions(
        IFunctionAuthenticator authenticator,
        IEntityService entityService)
        : base(entityService, authenticator)
    {
    }

    [FunctionName("Conduct")]
    [OpenApiOperation(operationId: nameof(ConductFunctions), tags: new[] { "Conducts" })]
    public async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "conduct/{entityId:guid}/{contactName}")]
        HttpRequest req,
        string entityId,
        string contactName,
        CancellationToken cancellationToken = default) =>
        await this.HandleAsync(req, ChannelNames.Device, entityId, contactName, cancellationToken);
}