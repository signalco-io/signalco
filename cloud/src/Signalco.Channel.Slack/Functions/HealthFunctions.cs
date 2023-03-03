using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Signal.Core.Secrets;
using Signalco.Common.Channel;

namespace Signalco.Channel.Slack.Functions;

public class HealthFunctions : HealthStatusFunctionsBase
{
    public HealthFunctions(ISecretsManager secretsManager) : base(secretsManager)
    {
    }

    [FunctionName("Status")]
    [OpenApiOperation(operationId: nameof(HealthFunctions), tags: new[] {"Health"})]
    [OpenApiResponseWithoutBody(HttpStatusCode.OK, Description = "API is running.")]
    public Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = "status")]
        HttpRequest req) => this.HandleAsync();
}