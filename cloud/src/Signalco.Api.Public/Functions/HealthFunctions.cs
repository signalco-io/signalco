using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Signal.Api.Common.OpenApi;

namespace Signalco.Api.Public.Functions;

public class HealthFunctions
{
    [Function("Status")]
    [OpenApiOperation<HealthFunctions>("Health")]
    [OpenApiResponseWithoutBody]
    public IActionResult Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = "status")] HttpRequestData req) =>
        new OkResult();
}