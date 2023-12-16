using System.IO;
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.OpenApi.Models;
using Signal.Api.Common.Auth;
using Signal.Api.Common.Exceptions;
using Signal.Api.Common.OpenApi;
using Signal.Core.Entities;
using Signal.Core.Exceptions;
using Signal.Core.Storage;

namespace Signalco.Api.Public.Functions.Station;

public class StationLoggingDownloadFunction(
    IFunctionAuthenticator functionAuthenticator,
    IEntityService entityService,
    IAzureStorageDao azureStorageDao)
{
    [Function("Station-Logging-Download")]
    [OpenApiSecurityAuth0Token]
    [OpenApiOperation<StationLoggingDownloadFunction>("Station")]
    [OpenApiParameter("stationId", In = ParameterLocation.Query, Required = true, Type = typeof(string),
        Description = "The **stationId** parameter")]
    [OpenApiParameter("blobName", In = ParameterLocation.Query, Required = true, Type = typeof(string),
        Description = "The **blobName** parameter. Use list function to obtain available blobs.")]
    [OpenApiResponseBadRequestValidation]
    public async Task<HttpResponseData> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "stations/logging/download")]
        HttpRequestData req,
        CancellationToken cancellationToken = default) =>
        await req.UserRequest(cancellationToken, functionAuthenticator, async context =>
        {
            var stationId = req.Query["stationId"];
            if (string.IsNullOrWhiteSpace(stationId))
                throw new ExpectedHttpException(HttpStatusCode.BadRequest, "stationId is required");
            var blobName = req.Query["blobName"];
            if (string.IsNullOrWhiteSpace(blobName))
                throw new ExpectedHttpException(HttpStatusCode.BadRequest, "blobName is required");

            await context.ValidateUserAssignedAsync(
                entityService,
                stationId);

            var stream = await azureStorageDao.LoggingDownloadAsync(blobName, cancellationToken);
            var content = Encoding.UTF8.GetBytes(await new StreamReader(stream).ReadToEndAsync(cancellationToken));

            var response = req.CreateResponse();
            response.StatusCode = HttpStatusCode.OK;
            response.Headers.Add("Content-Type", "text/plain");
            await response.WriteBytesAsync(content, cancellationToken);
            return response;
        });
}