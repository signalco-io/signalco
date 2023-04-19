using Microsoft.AspNetCore.Mvc;

namespace Signalco.Common.Channel;

public abstract class HealthStatusFunctionsBase
{
    protected async Task<HttpResponseData> HandleAsync() =>
        new OkResult();
}