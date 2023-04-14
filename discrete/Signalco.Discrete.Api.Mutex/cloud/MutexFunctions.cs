using System.Net;
using Azure;
using Azure.Data.Tables;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Signalco.Discrete.Api.Mutex;

public class MutexFunctions
{
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

        var client = this.TableClient();

        var resource =
            await client.GetEntityIfExistsAsync<TableEntity>(
                "keys", 
                key,
                cancellationToken: cancellationToken);
        if (resource is {HasValue: true})
        {
            // TODO: Ignore if expired
            return req.CreateResponse(HttpStatusCode.Conflict);
        }

        try
        {
            var result = await client.AddEntityAsync(new TableEntity("keys", key), cancellationToken);
            if (result.IsError)
                throw new Exception($"Status: {result.Status}");

            return req.CreateResponse(HttpStatusCode.Accepted);
        }
        catch (RequestFailedException err)
        {
            if (err.ErrorCode == "TableNotFound")
                await this.TableServiceClient().CreateTableAsync("mutex", cancellationToken);

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

    private TableServiceClient TableServiceClient()
    {
        this.configuration ??= this.serviceProvider.GetService<IConfiguration>();
        if (this.configuration == null)
            throw new Exception("Configuration unavailable in this context.");

        return staticTableServiceClient ??=
            new TableServiceClient(this.configuration["StorageAccountConnectionString"]);
    }

    private TableClient TableClient()
    {
        this.configuration ??= this.serviceProvider.GetService<IConfiguration>();
        if (this.configuration == null)
            throw new Exception("Configuration unavailable in this context.");

        return staticTableClient ??= new TableClient(this.configuration["StorageAccountConnectionString"], "mutex");
    }

    private static TableServiceClient? staticTableServiceClient = null;

    private static TableClient? staticTableClient = null;
}