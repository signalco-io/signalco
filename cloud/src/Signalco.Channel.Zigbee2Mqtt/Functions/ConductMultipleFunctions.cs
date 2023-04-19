using System.Collections.Generic;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
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

    [Function("Conduct-Multiple")]
    [OpenApiSecurityAuth0Token]
    [OpenApiOperation<ConductMultipleFunctions>("Conducts",
        Description = "Requests multiple conducts to be executed.")]
    [OpenApiJsonRequestBody<List<ConductRequestDto>>(
        Description = "Collection of conducts to execute.")]
    [OpenApiResponseWithoutBody(HttpStatusCode.OK)]
    [OpenApiResponseBadRequestValidation]
    public async Task<HttpResponseData> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "conducts/request-multiple")]
        HttpRequestData req,
        [SignalR(HubName = "conducts")] IAsyncCollector<SignalRMessage> signalRMessages,
        CancellationToken cancellationToken = default) =>
        await this.HandleAsync(req, signalRMessages, cancellationToken);
}