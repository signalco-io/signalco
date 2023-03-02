using System;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Polly;
using Polly.CircuitBreaker;
using Signal.Beacon.Application.Auth;
using Signal.Beacon.Application.Signal.Client.Station;

namespace Signal.Beacon.Application.Signal.Client;

internal class SignalcoClient : ISignalClient, ISignalcoClientAuthFlow
{
    private const string ApiUrl = "https://api.signalco.io/api";

    private static readonly string ApiStationRefreshTokenUrl = "/station/refresh-token";

    private readonly ILogger<SignalcoClient> logger;
    private readonly HttpClient client = new();
    private AuthToken? token;
    private readonly SemaphoreSlim renewLock = new(1, 1);
    private readonly AsyncCircuitBreakerPolicy circuitBreakerPolicy;

    public event EventHandler<AuthToken?>? OnTokenRefreshed;

    private static readonly JsonSerializerOptions CaseInsensitiveOptions = new() { PropertyNameCaseInsensitive = true };

    public SignalcoClient(
        ILogger<SignalcoClient> logger)
    {
        this.logger = logger ?? throw new ArgumentNullException(nameof(logger));
        this.circuitBreakerPolicy = Policy
            .Handle<HttpRequestException>(ex =>
                ex.StatusCode.HasValue && ((int)ex.StatusCode > 500 || ex.StatusCode == HttpStatusCode.RequestTimeout))
            .AdvancedCircuitBreakerAsync(
                failureThreshold: 0.5,
                samplingDuration: TimeSpan.FromSeconds(10),
                minimumThroughput: 4,
                durationOfBreak: TimeSpan.FromSeconds(30));
    }


    public void AssignToken(AuthToken newToken)
    {
        this.token = newToken;
        this.client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", this.token.AccessToken);

        this.logger.LogDebug("Token successfully assigned. Expires on: {TokenExpire}", this.token.Expire);
    }

    public async Task<AuthToken?> GetTokenAsync(CancellationToken cancellationToken)
    {
        await this.RenewTokenIfExpiredAsync(cancellationToken);
        return this.token;
    }

    private async Task RenewTokenIfExpiredAsync(CancellationToken cancellationToken)
    {
        // Can't renew unassigned token (used for unauthenticated requests)
        if (this.token == null)
            return;

        // Not expired
        if (DateTime.UtcNow < this.token.Expire)
            return;

        // Lock
        try
        {
            await this.renewLock.WaitAsync(cancellationToken);

            // Request new token from Signal API
            var response = await this.PostAsJsonAsync<SignalcoStationRefreshTokenRequestDto, SignalcoStationRefreshTokenResponseDto>(
                ApiStationRefreshTokenUrl,
                new SignalcoStationRefreshTokenRequestDto(this.token.RefreshToken),
                cancellationToken,
                false);
            if (response == null)
                throw new Exception("Failed to renew token - got null response.");

            // Check if someone else assigned new token already
            if (DateTime.UtcNow < this.token.Expire)
                return;

            // Assign new token
            this.AssignToken(new AuthToken(response.AccessToken, this.token.RefreshToken, response.Expire));
            this.logger.LogDebug("Token successfully refreshed. Expires on: {TokenExpire}", this.token.Expire);
        }
        finally
        {
            this.renewLock.Release();
        }

        // Notify token was refreshed so it can be persisted
        this.OnTokenRefreshed?.Invoke(this, await this.GetTokenAsync(cancellationToken));
    }

    public async Task PostAsJsonAsync<T>(string url, T data, CancellationToken cancellationToken)
    {
        await this.HandleHttpErrorsAsync<T>(async () =>
        {
            await this.RenewTokenIfExpiredAsync(cancellationToken);

            using var response = await this.circuitBreakerPolicy.ExecuteAsync(async () =>
                await this.client.PostAsJsonAsync($"{ApiUrl}{url}", data, cancellationToken));
            if (!response.IsSuccessStatusCode)
                throw new Exception(
                    $"Signal API POST {ApiUrl}{url} failed. Reason: {await response.Content.ReadAsStringAsync(cancellationToken)} ({response.StatusCode})");

            return default;
        });
    }

    public async Task<TResponse?> PostAsJsonAsync<TRequest, TResponse>(string url, TRequest data, CancellationToken cancellationToken, bool renewTokenIfExpired = true)
    {
        return await this.HandleHttpErrorsAsync(async () =>
        {
            if (renewTokenIfExpired)
                await this.RenewTokenIfExpiredAsync(cancellationToken);

            using var response = await this.circuitBreakerPolicy.ExecuteAsync(async () =>
                await this.client.PostAsJsonAsync($"{ApiUrl}{url}", data, cancellationToken));
            if (response.IsSuccessStatusCode)
            {
                if (response.StatusCode == HttpStatusCode.NoContent)
                    throw new Exception(
                        $"API returned NOCONTENT but we expected response of type {typeof(TResponse).FullName}");

                try
                {
                    var responseData = await response.Content.ReadFromJsonAsync<TResponse>(
                        CaseInsensitiveOptions,
                        cancellationToken);
                    return responseData;
                }
                catch (JsonException ex)
                {
                    var responseDataString = await response.Content.ReadAsStringAsync(cancellationToken);
                    this.logger.LogTrace(ex, "Failed to read response JSON.");
                    this.logger.LogDebug("Reading response JSON failed. Raw: {DataString}", responseDataString);
                    throw;
                }
            }

            var responseContent = await this.GetResponseContentStringAsync(response, cancellationToken);
            throw new Exception(
                $"Signal API POST {ApiUrl}{url} failed. Reason: {responseContent} ({response.StatusCode})");
        });
    }

    public async Task<T?> GetAsync<T>(string url, CancellationToken cancellationToken)
    {
        return await this.HandleHttpErrorsAsync(async () =>
        {
            await this.RenewTokenIfExpiredAsync(cancellationToken);

            return await this.circuitBreakerPolicy.ExecuteAsync(async () =>
                await this.client.GetFromJsonAsync<T>(
                    $"{ApiUrl}{url}",
                    CaseInsensitiveOptions,
                    cancellationToken));
        });
    }

    public async Task DeleteAsync<T>(string url, T payload, CancellationToken cancellationToken)
    {
        await this.HandleHttpErrorsAsync(async () =>
        {
            await this.RenewTokenIfExpiredAsync(cancellationToken);

            return await this.circuitBreakerPolicy.ExecuteAsync(async () =>
                await this.client.SendAsync(new HttpRequestMessage(HttpMethod.Delete, $"{ApiUrl}{url}")
                {
                    Content = new StringContent(JsonSerializer.Serialize(payload, CaseInsensitiveOptions))
                }, cancellationToken));
        });
    }

    private async Task<T?> HandleHttpErrorsAsync<T>(Func<Task<T?>> func)
    {
        try
        {
            return await func();
        }
        catch (HttpRequestException ex) when (ex.StatusCode == HttpStatusCode.ServiceUnavailable)
        {
            this.logger.LogTrace(ex, "API unavailable");
            this.logger.LogWarning("API unavailable");
            throw;
        }
    }

    private async Task<string> GetResponseContentStringAsync(
        HttpResponseMessage response,
        CancellationToken cancellationToken)
    {
        try
        {
            var responseString = await response.Content.ReadAsStringAsync(cancellationToken);
            return string.IsNullOrWhiteSpace(responseString) ? "No content." : responseString;
        }
        catch (Exception ex)
        {
            this.logger.LogDebug(ex, "Failed to read API response content.");
            return "Failed to read API response content.";
        }
    }
}