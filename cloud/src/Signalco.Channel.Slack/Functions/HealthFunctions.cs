using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Signal.Api.Common.OpenApi;
using Signalco.Api.Common.Health;
using Signalco.Common.Channel;

namespace Signalco.Channel.Slack.Functions;

public class HealthFunctions : HealthStatusFunctionsBase
{
    [Function("Status")]
    [OpenApiOperation<HealthFunctions>("Health")]
    [OpenApiResponseWithoutBody]
    public Task<HttpResponseData> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = "status")]
        HttpRequestData req) => this.HandleAsync(req);
}