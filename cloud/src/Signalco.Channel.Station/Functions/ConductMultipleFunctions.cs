using System.Collections.Generic;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Signal.Api.Common.Auth;
using Signal.Api.Common.OpenApi;
using Signal.Core.Conducts;
using Signal.Core.Entities;
using Signal.Core.Notifications;
using Signal.Core.Storage;
using Signalco.Common.Channel;

namespace Signalco.Channel.Station.Functions;

public class ConductMultipleFunctions(
        IEntityService entityService,
        IAzureStorageDao storageDao,
        IAzureStorage storage,
        IFunctionAuthenticator authenticator,
        ISignalRService signalRService)
    : ConductMultipleFunctionsForwardToStationBase(entityService, storageDao, authenticator, storage, signalRService)
{
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
        CancellationToken cancellationToken = default) =>
        await this.HandleAsync(req, cancellationToken);
}