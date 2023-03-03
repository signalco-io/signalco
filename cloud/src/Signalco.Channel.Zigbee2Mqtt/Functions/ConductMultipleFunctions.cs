using System.Collections.Generic;
using System.Net;
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
using Signal.Core.Storage;
using Signalco.Common.Channel;

namespace Signalco.Channel.Zigbee2Mqtt.Functions;

public class ConductMultipleFunctions : ConductMultipleFunctionsForwardToStationBase
{
    public ConductMultipleFunctions(
        IEntityService entityService, 
        IAzureStorageDao storageDao,
        IFunctionAuthenticator authenticator,
        IAzureStorage storage) 
        : base(entityService, storageDao, authenticator, storage)
    {
    }

    [FunctionName("Conduct-Multiple")]
    [OpenApiSecurityAuth0Token]
    [OpenApiOperation(nameof(ConductMultipleFunctions), "Conducts",
        Description = "Requests multiple conducts to be executed.")]
    [OpenApiRequestBody("application/json", typeof(List<ConductRequestDto>),
        Description = "Collection of conducts to execute.")]
    [OpenApiResponseWithoutBody(HttpStatusCode.OK)]
    [OpenApiResponseBadRequestValidation]
    public async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "conducts/request-multiple")]
        HttpRequest req,
        [SignalR(HubName = "conducts")] IAsyncCollector<SignalRMessage> signalRMessages,
        CancellationToken cancellationToken = default) =>
        await this.HandleAsync(req, signalRMessages, cancellationToken);
}