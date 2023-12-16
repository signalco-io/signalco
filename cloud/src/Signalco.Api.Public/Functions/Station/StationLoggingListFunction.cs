using System;
using System.Collections.Generic;
using System.Net;
using System.Text.Json.Serialization;
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

public class StationLoggingListFunction(
    IFunctionAuthenticator functionAuthenticator,
    IEntityService entityService,
    IAzureStorageDao storageDao)
{
    [Function("Station-Logging-List")]
    [OpenApiSecurityAuth0Token]
    [OpenApiOperation<StationLoggingListFunction>("Station")]
    [OpenApiParameter("stationId", In = ParameterLocation.Query, Required = true, Type = typeof(string),
        Description = "The **StationID** parameter")]
    [OpenApiOkJsonResponse<List<BlobInfoDto>>(Description = "List of blob infos.")]
    [OpenApiResponseBadRequestValidation]
    public async Task<HttpResponseData> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "station/logging/list")]
        HttpRequestData req,
        CancellationToken cancellationToken = default) =>
        await req.UserRequest(cancellationToken, functionAuthenticator, async context =>
        {
            var stationId = req.Query["stationId"];
            if (string.IsNullOrWhiteSpace(stationId))
                throw new ExpectedHttpException(HttpStatusCode.BadRequest, "stationId is required");

            await context.ValidateUserAssignedAsync(
                entityService,
                stationId);

            var items = new List<BlobInfoDto>();
            await foreach (var item in storageDao.LoggingListAsync(stationId, cancellationToken))
                items.Add(new BlobInfoDto(item.Name, item.CreatedTimeStamp, item.LastModifiedTimeStamp, item.Size));

            return items;
        });

    [Serializable]
    private record BlobInfoDto(
        [property: JsonPropertyName("name")] string Name,
        [property: JsonPropertyName("createdTimeStamp")] DateTimeOffset? CreatedTimeStamp,
        [property: JsonPropertyName("modifiedTimeStamp")] DateTimeOffset? ModifiedTimeStamp,
        [property: JsonPropertyName("size")] long? Size);
}
