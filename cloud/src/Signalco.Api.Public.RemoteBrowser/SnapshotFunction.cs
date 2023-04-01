using System;
using System.Text.Json.Serialization;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;

namespace Signalco.Api.Public.RemoteBrowser;

public class SnapshotFunction
{
    [FunctionName("Snapshot")]
    public async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "snapshot")]
        HttpRequest req,
        CancellationToken cancellationToken = default)
    {
        // TODO: Authorize using access key
        // TODO: Resolve URL for snapshot
        // TODO: Check if cache available
        // TODO: Request from RemoteBrowser app
        // TODO:     - Read config for RemoteBrowser app URL

        throw new NotImplementedException();
    }

    private async Task<ScreenshotResult> RetrieveCached()
    {
        try
        {
            throw new NotImplementedException();
        }
        catch
        {
            // TODO: Log
            return null;
        }
    }

    private async Task CacheAsync(ScreenshotResult result)
    {
        try
        {
            // TODO: Hash request to quickly find matching
            // TODO: Use domain as partition
            // TODO: Use hash as rowKey

            throw new NotImplementedException();
        }
        catch
        {
            // TODO: Log
        }
    }
}

public record ScreenshotRequest(
    [property: JsonPropertyName("url")] string Url);

public record ScreenshotResult(
    DateTime RequestedTimeStamp,
    DateTime? ResultTimeStamp,
    ScreenshotRequest Request);
