using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Security.Claims;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using Signal.Core.Auth;
using Signal.Core.Secrets;

namespace Signal.Api.Common.Auth;

public class FunctionAuth0Authenticator(
        ISecretsProvider secretsProvider,
        ILogger<FunctionAuth0Authenticator> logger)
    : IFunctionAuthenticator
{
    private const string RefreshTokenUrlPath = "/oauth/token";
    private IJwtAuthenticator? authenticator;

    private async Task<Auth0Authenticator> InitializeAuthenticatorAsync(bool allowExpiredToken, CancellationToken cancellationToken = default)
    {
        var domain = await secretsProvider.GetSecretAsync(SecretKeys.Auth0.Domain, cancellationToken);
        var audience = await secretsProvider.GetSecretAsync(SecretKeys.Auth0.ApiIdentifier, cancellationToken);
        return new Auth0Authenticator(domain, [audience], allowExpiredToken, secretsProvider);
    }

    public async Task<IUserRefreshToken> RefreshTokenAsync(
        HttpRequestData request,
        string refreshToken,
        CancellationToken cancellationToken = default)
    {
        var refreshAuthenticator = await this.InitializeAuthenticatorAsync(true, cancellationToken);
        if (refreshAuthenticator == null)
            throw new NullReferenceException("Authenticator failed to initialize.");

        // We don't really need the info about user, but we want to make sure
        // token was valid before it expired so we authenticate without lifetime validation
        await refreshAuthenticator.AuthenticateAsync(request, cancellationToken);

        // Request new token
        var domainTask = secretsProvider.GetSecretAsync(SecretKeys.Auth0.Domain, cancellationToken);
        var clientSecretTask = secretsProvider.GetSecretAsync(SecretKeys.Auth0.ClientSecretStation, cancellationToken);
        var clientIdTask = secretsProvider.GetSecretAsync(SecretKeys.Auth0.ClientIdStation, cancellationToken);
        await Task.WhenAll(domainTask, clientSecretTask, clientIdTask);

        var refreshTokenUrl = $"https://{domainTask.Result}{RefreshTokenUrlPath}";
        using var response = await new HttpClient().PostAsync(refreshTokenUrl, new FormUrlEncodedContent(
        [
            new KeyValuePair<string, string>("grant_type", "refresh_token"),
            new KeyValuePair<string, string>("client_id", clientIdTask.Result),
            new KeyValuePair<string, string>("client_secret", clientSecretTask.Result),
            new KeyValuePair<string, string>("refresh_token", refreshToken)
        ]), cancellationToken);
        if (!response.IsSuccessStatusCode)
            throw new Exception(
                $"Token refresh failed. Reason: {await response.Content.ReadAsStringAsync(cancellationToken)} ({response.StatusCode})");

        var tokenResultString = await response.Content.ReadAsStringAsync(cancellationToken);
        if (string.IsNullOrWhiteSpace(tokenResultString))
            throw new Exception("Auth0 responded with empty response.");

        var tokenResult = JsonSerializer.Deserialize<Auth0RefreshTokenResult>(tokenResultString);
        if (tokenResult == null || 
            string.IsNullOrWhiteSpace(tokenResult.AccessToken))
            throw new Exception("Got invalid access token - null or whitespace.");

        return new UserRefreshToken(
            tokenResult.AccessToken,
            DateTime.UtcNow.AddSeconds(tokenResult.ExpiresIn ?? 60));
    }

    public async Task<bool> AuthenticateSystemAsync(HttpRequestData req, CancellationToken cancellationToken = default)
    {
        try
        {
            if (!req.Headers.Contains(KnownHeaders.ProcessorAccessCode))
                throw new Exception("Internal key not available");

            var providedKey = req.Headers.GetValues(KnownHeaders.ProcessorAccessCode).First();
            var realKey = await secretsProvider.GetSecretAsync(SecretKeys.ProcessorAccessCode, cancellationToken);
            if (providedKey != realKey)
                throw new Exception("Invalid system key");

            return true;
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "System Authorization failed");
            throw new AuthenticationExpectedHttpException(ex.Message);
        }
    }

    public async Task<IUserAuth> AuthenticateAsync(HttpRequestData request, CancellationToken cancellationToken = default)
    {
        try
        {
            this.authenticator ??= await this.InitializeAuthenticatorAsync(false, cancellationToken);
            if (this.authenticator == null)
                throw new NullReferenceException("Authenticator failed to initialize.");

            var (user, _) = await this.authenticator.AuthenticateAsync(request, cancellationToken);
            var nameIdentifier = user.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrWhiteSpace(nameIdentifier))
                throw new AuthenticationExpectedHttpException("NameIdentifier claim not present.");

            return new UserAuth(nameIdentifier);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Authorization failed");
            throw new AuthenticationExpectedHttpException(ex.Message);
        }
    }

    private class Auth0RefreshTokenResult
    {
        [JsonPropertyName("access_token")]
        public string? AccessToken { get; set; }

        [JsonPropertyName("expires_in")]
        public int? ExpiresIn { get; set; }

        [JsonPropertyName("scope")]
        public string? Scope { get; set; }

        [JsonPropertyName("id_token")]
        public string? IdToken { get; set; }

        [JsonPropertyName("token_type")]
        public string? TokenType { get; set; }
    }

    private class UserRefreshToken(string accessToken, DateTime expire) : IUserRefreshToken
    {
        public string AccessToken { get; } = accessToken;

        public DateTime Expire { get; } = expire;
    }
}