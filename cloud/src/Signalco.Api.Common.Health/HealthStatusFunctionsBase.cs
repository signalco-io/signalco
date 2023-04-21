using System.Net;
using Microsoft.Azure.Functions.Worker.Http;

namespace Signalco.Api.Common.Health;

public abstract class HealthStatusFunctionsBase
{
    protected Task<HttpResponseData> HandleAsync(HttpRequestData req) =>
        Task.FromResult(req.CreateResponse(HttpStatusCode.OK));
}