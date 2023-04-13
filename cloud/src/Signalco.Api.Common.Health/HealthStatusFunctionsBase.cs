using Microsoft.AspNetCore.Mvc;

namespace Signalco.Common.Channel;

public abstract class HealthStatusFunctionsBase
{
    protected async Task<IActionResult> HandleAsync() =>
        new OkResult();
}