using System.Net;
using System.Text.Json;
using Azure;
using Azure.Data.Tables;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Signalco.Discrete.Api.Mutex;

public class MutexFunctions
{
    private static readonly TimeSpan DefaultLeaseDuration = TimeSpan.FromMinutes(30);
    private readonly IServiceProvider serviceProvider;
    private IConfiguration? configuration;

    public MutexFunctions(IServiceProvider serviceProvider)
    {
        this.serviceProvider = serviceProvider ?? throw new ArgumentNullException(nameof(serviceProvider));
    }

    [Function("Mutex-Wait")]
    public async Task<HttpResponseData> RunWait(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "wait/{key}")] HttpRequestData req,
        string key,
        CancellationToken cancellationToken)
    {
        if (!KeyValid(key))
            return req.CreateResponse(HttpStatusCode.BadRequest);

        DateTimeOffset? requestedExpiration = null;
        using var reader = new StreamReader(req.Body, leaveOpen: true);
        var body = await reader.ReadToEndAsync(cancellationToken);
        if (!string.IsNullOrWhiteSpace(body))
        {
            try
            {
                using var document = JsonDocument.Parse(body);
                if (document.RootElement.ValueKind != JsonValueKind.Object)
                    return req.CreateResponse(HttpStatusCode.BadRequest);

                if (document.RootElement.TryGetProperty("expire", out var expire))
                {
                    if (expire.ValueKind != JsonValueKind.String ||
                        !expire.TryGetDateTimeOffset(out var date) ||
                        !HasTimeZone(expire.GetString()!))
                        return req.CreateResponse(HttpStatusCode.BadRequest);

                    requestedExpiration = date.ToUniversalTime();
                }
            }
            catch (JsonException)
            {
                return req.CreateResponse(HttpStatusCode.BadRequest);
            }
        }

        var clock = this.serviceProvider.GetService<TimeProvider>() ?? TimeProvider.System;
        if (requestedExpiration <= clock.GetUtcNow())
            return req.CreateResponse(HttpStatusCode.BadRequest);

        var client = this.TableClient();
        try
        {
            var resource = await client.GetEntityIfExistsAsync<TableEntity>(
                "keys", key, cancellationToken: cancellationToken);
            var now = clock.GetUtcNow();
            var existingLease = resource.HasValue ? resource.Value : null;
            if (resource.HasValue && (existingLease == null || !IsExpired(existingLease, now)))
                return req.CreateResponse(HttpStatusCode.Conflict);

            var expiration = requestedExpiration ?? now.Add(DefaultLeaseDuration);
            if (expiration <= now)
                return req.CreateResponse(HttpStatusCode.BadRequest);

            var lease = new TableEntity("keys", key) { ["expire"] = expiration };
            Response result;
            if (existingLease != null)
            {
                // Never overwrite a lease acquired since our read, or recreate a deleted lease.
                var etag = existingLease.ETag;
                if (string.IsNullOrWhiteSpace(etag.ToString()) || etag == ETag.All)
                    return req.CreateResponse(HttpStatusCode.Conflict);

                result = await client.UpdateEntityAsync(lease, etag, TableUpdateMode.Replace, cancellationToken);
            }
            else
            {
                result = await client.AddEntityAsync(lease, cancellationToken);
            }
            if (result.IsError)
                throw new Exception($"Status: {result.Status}");

            return req.CreateResponse(HttpStatusCode.Accepted);
        }
        catch (RequestFailedException err) when (err.Status is 404 or 409 or 412)
        {
            if (err.ErrorCode == "TableNotFound")
                await this.TableServiceClient().CreateTableIfNotExistsAsync("mutex", cancellationToken);

            return req.CreateResponse(HttpStatusCode.Conflict);
        }
    }

    [Function("Mutex-Release")]
    public async Task<HttpResponseData> RunRelease(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "release/{key}")] HttpRequestData req,
        string key,
        CancellationToken cancellationToken)
    {
        if (!KeyValid(key))
            return req.CreateResponse(HttpStatusCode.BadRequest);

        var client = this.TableClient();
        await client.DeleteEntityAsync("keys", key, cancellationToken: cancellationToken);
        return req.CreateResponse(HttpStatusCode.Accepted);
    }

    private static bool KeyValid(string key)
    {
        return true;
    }

    private static bool HasTimeZone(string date) =>
        date.EndsWith('Z') ||
        date.Length >= 6 && (date[^6] is '+' or '-') && date[^3] == ':';

    private static bool IsExpired(TableEntity lease, DateTimeOffset now)
    {
        if (lease.TryGetValue("expire", out var expiration))
            return expiration is DateTimeOffset date && date <= now;

        // Existing rows predate explicit expirations. Unknown timestamps fail closed.
        return lease.Timestamp is { } timestamp && timestamp <= now.Subtract(DefaultLeaseDuration);
    }

    private TableServiceClient TableServiceClient()
    {
        if (this.serviceProvider.GetService<TableServiceClient>() is { } client)
            return client;

        this.configuration ??= this.serviceProvider.GetService<IConfiguration>();
        if (this.configuration == null)
            throw new Exception("Configuration unavailable in this context.");

        return staticTableServiceClient ??=
            new TableServiceClient(this.configuration["StorageAccountConnectionString"]);
    }

    private TableClient TableClient()
    {
        if (this.serviceProvider.GetService<TableClient>() is { } client)
            return client;

        this.configuration ??= this.serviceProvider.GetService<IConfiguration>();
        if (this.configuration == null)
            throw new Exception("Configuration unavailable in this context.");

        return staticTableClient ??= new TableClient(this.configuration["StorageAccountConnectionString"], "mutex");
    }

    private static TableServiceClient? staticTableServiceClient = null;

    private static TableClient? staticTableClient = null;
}
