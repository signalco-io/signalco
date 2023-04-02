using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text.Json.Serialization;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using Signal.Core.Secrets;

namespace Signalco.Api.Public.RemoteBrowser;

public class ScreenshotFunction
{
    private readonly ISecretsProvider secretsProvider;
    private readonly HttpClient httpClient = new();

    public ScreenshotFunction(
        ISecretsProvider secretsProvider)
    {
        this.secretsProvider = secretsProvider ?? throw new ArgumentNullException(nameof(secretsProvider));
    }

    [FunctionName("Screenshot")]
    public async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", "get", Route = "screenshot")]
        HttpRequest req,
        ILogger logger,
        CancellationToken cancellationToken = default)
    {
        var startTimeStamp = DateTime.UtcNow;

        // TODO: Authorize using access key

        var request = new ScreenshotRequest(
            req.Query["url"], 
            req.Query["scrollThrough"].ToString().ToLowerInvariant() == "true");

        // TODO: Validate request
        // TODO: Fix URL to contain only absolute URLs with protocol

        // Check if cache available
        if (await this.RetrieveCachedAsync(request, cancellationToken) is { } cachedResult)
            return ScreenshotResultToActionResult(cachedResult);

        var result = await this.MakeScreenshotAsync(startTimeStamp, request, logger, cancellationToken);

        // TODO: Make image thumbnail
        // TODO: Persist request and thumbnail (show to user on UI)

        await this.CacheAsync(result, cancellationToken);
        return ScreenshotResultToActionResult(result);
    }

    private static IActionResult ScreenshotResultToActionResult(ScreenshotResult result)
    {
        if (result.ImageData == null || result.ImageContentType == null)
            return new InternalServerErrorResult();

        var streamOut = new MemoryStream();
        streamOut.Write(result.ImageData);
        streamOut.Position = 0;
        return new FileStreamResult(streamOut, result.ImageContentType);
    }

    private async Task<ScreenshotResult> MakeScreenshotAsync(
        DateTime startTimeStamp, 
        ScreenshotRequest request,
        ILogger logger, 
        CancellationToken cancellationToken = default)
    {
        try
        {
            // Read config for RemoteBrowser app URL
            var url = await this.secretsProvider.GetSecretAsync(SecretKeys.AppRemoteBrowserUrl, cancellationToken);

            var queryParams = new List<string>
            {
                $"url={request.Url}"
            };
            if (request.ScrollThrough == true)
                queryParams.Add("scrollThrough=true");

            // Construct request for RemoteBrowser app
            var reqUrl = $"{url}/api/screenshot?{string.Join("&", queryParams)}";

            // TODO: Use http client factory
            // Request from RemoteBrowser app
            using var response = await this.httpClient.GetAsync(reqUrl, cancellationToken);
            var bytes = await response.Content.ReadAsByteArrayAsync(cancellationToken);
            var contentType = response.Content.Headers.ContentType?.ToString() ?? "image/png";

            return new ScreenshotResult(
                startTimeStamp,
                DateTime.UtcNow,
                request,
                bytes,
                contentType);
        }
        catch(Exception ex)
        {
            logger.LogError(ex, "Failed to make screenshot");
            return new ScreenshotResult(
                startTimeStamp, DateTime.UtcNow, request, null, null);
        }
    }

    private async Task<ScreenshotResult> RetrieveCachedAsync(ScreenshotRequest request, CancellationToken cancellationToken = default)
    {
        try
        {
            // TODO: Resolve URL for snapshot
            // TODO: Hash request to quickly find matching
            // TODO: Use domain as partition
            // TODO: Use hash as rowKey
            throw new NotImplementedException();
        }
        catch
        {
            // TODO: Log
            return null;
        }
    }

    private async Task CacheAsync(ScreenshotResult result, CancellationToken cancellationToken = default)
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
    [property: JsonPropertyName("url")] string Url,
    [property: JsonPropertyName("scrollThrough")] bool? ScrollThrough);

public record ScreenshotResult(
    DateTime RequestedTimeStamp,
    DateTime ResultTimeStamp,
    ScreenshotRequest Request,
    byte[]? ImageData,
    string? ImageContentType);
