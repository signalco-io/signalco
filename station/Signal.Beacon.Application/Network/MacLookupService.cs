using System;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Caching.Memory;
using Polly;
using Polly.Caching;
using Polly.Caching.Memory;
using Polly.Wrap;
using Signal.Beacon.Core.Network;

namespace Signal.Beacon.Application.Network;

public class MacLookupService : IMacLookupService
{
    private readonly AsyncPolicyWrap requestPolicy;
    private readonly IMemoryCache memoryCache;
    private readonly IAsyncCacheProvider memoryCacheProvider;

    public MacLookupService()
    {
        this.memoryCache = new MemoryCache(new MemoryCacheOptions());
        this.memoryCacheProvider = new MemoryCacheProvider(this.memoryCache);
        this.requestPolicy = Policy.WrapAsync(
            Policy.CacheAsync(this.memoryCacheProvider, TimeSpan.FromMinutes(5)),
            Policy.TimeoutAsync(5),
            Policy.BulkheadAsync(1),
            Policy
                .Handle<HttpRequestException>(ex => ex.StatusCode == HttpStatusCode.TooManyRequests)
                .WaitAndRetryAsync(new[]
                {
                    TimeSpan.FromSeconds(1),
                    TimeSpan.FromSeconds(2),
                    TimeSpan.FromSeconds(3)
                }));
    }

    public async Task<string?> CompanyNameLookupAsync(string physicalAddress, CancellationToken cancellationToken)
    {
        var result = await this.requestPolicy.ExecuteAndCaptureAsync((context, ct) =>
                new HttpClient().GetStringAsync(
                    $"https://api.maclookup.app/v2/macs/{physicalAddress}/company/name",
                    ct),
            new Context(physicalAddress),
            cancellationToken);

        return result.Result;
    }
}