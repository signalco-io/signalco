using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Signal.Api.Common.OpenApi;

namespace Signalco.Api.Public.RemoteBrowser;

public class StatusFunction
{
    [Function("Status")]
    [OpenApiOperation<StatusFunction>("Health")]
    [OpenApiResponseWithoutBody]
    public IActionResult Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = "status")] HttpRequestData req) =>
        new OkResult();
}