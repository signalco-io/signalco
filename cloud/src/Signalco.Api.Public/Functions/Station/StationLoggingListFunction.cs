using System;
using System.Collections.Generic;
using System.Net;
using System.Text.Json.Serialization;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.OpenApi.Models;
using Signal.Api.Common.Auth;
using Signal.Api.Common.Exceptions;
using Signal.Api.Common.OpenApi;
using Signal.Core.Entities;
using Signal.Core.Exceptions;
using Signal.Core.Storage;

namespace Signal.Api.Public.Functions.Station;

public class StationLoggingListFunction
{
    private readonly IFunctionAuthenticator functionAuthenticator;
    private readonly IEntityService entityService;
    private readonly IAzureStorageDao storageDao;

    public StationLoggingListFunction(
        IFunctionAuthenticator functionAuthenticator,
        IEntityService entityService,
        IAzureStorageDao storageDao)
    {
        this.functionAuthenticator =
            functionAuthenticator ?? throw new ArgumentNullException(nameof(functionAuthenticator));
        this.entityService = entityService ?? throw new ArgumentNullException(nameof(entityService));
        this.storageDao = storageDao ?? throw new ArgumentNullException(nameof(storageDao));
    }

    [FunctionName("Station-Logging-List")]
    [OpenApiSecurityAuth0Token]
    [OpenApiOperation(nameof(StationLoggingListFunction), "Station")]
    [OpenApiParameter("stationId", In = ParameterLocation.Query, Required = true, Type = typeof(string),
        Description = "The **StationID** parameter")]
    [OpenApiOkJsonResponse<List<BlobInfoDto>>(Description = "List of blob infos.")]
    [OpenApiResponseBadRequestValidation]
    public async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "station/logging/list")]
        HttpRequest req,
        CancellationToken cancellationToken = default) =>
        await req.UserRequest(cancellationToken, this.functionAuthenticator, async context =>
        {
            string stationId = req.Query["stationId"];
            if (string.IsNullOrWhiteSpace(stationId))
                throw new ExpectedHttpException(HttpStatusCode.BadRequest, "stationId is required");

            await context.ValidateUserAssignedAsync(
                this.entityService,
                stationId);

            var items = new List<BlobInfoDto>();
            await foreach (var item in this.storageDao.LoggingListAsync(stationId, cancellationToken))
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
