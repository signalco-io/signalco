﻿using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Signal.Api.Common.OpenApi;
using Signalco.Common.Channel;

namespace Signalco.Channel.GitHubApp.Functions;

public class HealthFunctions : HealthStatusFunctionsBase
{
    [Function("Status")]
    [OpenApiOperation<HealthFunctions>("Health")]
    [OpenApiResponseWithoutBody]
    public Task<HttpResponseData> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = "status")]
        HttpRequestData req) => this.HandleAsync();
}