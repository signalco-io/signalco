using System.Net;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;

namespace Signalco.Func.Internal.ContactStateProcessor;

public class StatusFunction
{
    [FunctionName("Status")]
    [OpenApiOperation(nameof(StatusFunction), "Health")]
    [OpenApiResponseWithoutBody(HttpStatusCode.OK, Description = "API is running.")]
    public IActionResult Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = "status")] HttpRequest req) =>
        new OkResult();
}