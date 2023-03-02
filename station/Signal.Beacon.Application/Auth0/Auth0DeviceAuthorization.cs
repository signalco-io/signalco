using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading;
using System.Threading.Tasks;
using Signal.Beacon.Application.Auth;

namespace Signal.Beacon.Application.Auth0;

public class Auth0DeviceAuthorization
{
    private const string DeviceCodeUrl = "https://dfnoise.eu.auth0.com/oauth/device/code";
    private const string DeviceTokenUrl = "https://dfnoise.eu.auth0.com/oauth/token";
    private const string GrantType = "urn:ietf:params:oauth:grant-type:device_code";
    private const string ClientId = "xTGmoA6adYC9hk7dVbYflHnWBjjTcoE3";
    private const string Scope = "profile email offline_access";
    private const string Audience = "https://api.signalco.io";
        
    public async Task<DeviceCodeResponse> GetDeviceCodeAsync(CancellationToken cancellationToken)
    {
        using var response = await new HttpClient().PostAsync(DeviceCodeUrl, new FormUrlEncodedContent(
            new List<KeyValuePair<string?, string?>>
            {
                new("client_id", ClientId),
                new("scope", Scope),
                new("audience", Audience),
            }), cancellationToken);

        var content = await response.Content.ReadAsStringAsync(cancellationToken);
        var deviceCodeResponse = JsonSerializer.Deserialize<Auth0DeviceCodeResponseDto>(content);
        if (deviceCodeResponse == null)
            throw new Exception("Unable to deserialize Auth0 device code response.");

        return new DeviceCodeResponse
        {
            CheckTokenInterval = TimeSpan.FromSeconds(deviceCodeResponse.Interval),
            DeviceCode = deviceCodeResponse.DeviceCode,
            UserCode = deviceCodeResponse.UserCode,
            Url = deviceCodeResponse.VerificationUri,
            UrlComplete = deviceCodeResponse.VerificationUriComplete
        };
    }

    public async Task<AuthToken?> WaitTokenAsync(DeviceCodeResponse codeResponse,
        CancellationToken cancellationToken)
    {
        while (!cancellationToken.IsCancellationRequested)
        {
            using var response = await new HttpClient().PostAsync(DeviceTokenUrl, new FormUrlEncodedContent(
                new List<KeyValuePair<string?, string?>>
                {
                    new("client_id", ClientId),
                    new("grant_type", GrantType),
                    new("device_code", codeResponse.DeviceCode)
                }), cancellationToken);
            if (response.IsSuccessStatusCode)
            {
                var token = await response.Content.ReadFromJsonAsync<Auth0Token>(
                    cancellationToken: cancellationToken);
                if (token == null)
                    throw new Exception("Didn't get token.");
                if (string.IsNullOrWhiteSpace(token.AccessToken))
                    throw new Exception("Got invalid access token.");
                if (string.IsNullOrWhiteSpace(token.RefreshToken))
                    throw new Exception("Didn't get refresh token.");

                return new AuthToken(
                    token.AccessToken,
                    token.RefreshToken,
                    DateTime.UtcNow.AddSeconds(token.ExpiresIn ?? 60));
            }

            var error = await response.Content.ReadFromJsonAsync<Auth0Error>(cancellationToken: cancellationToken);
            if (error == null)
                throw new Exception("Failed to authenticate. Invalid response.");

            if (error.Error == "expired_token" || error.Error == "access_denied")
                throw new Exception($"Failed to authenticate. Error {error.Error} - {error.ErrorDescription}");

            await Task.Delay(codeResponse.CheckTokenInterval, cancellationToken);
        }

        return null;
    }
        
    private class Auth0Token
    {
        [JsonPropertyName("access_token")] 
        public string? AccessToken { get; set; }

        [JsonPropertyName("refresh_token")] 
        public string? RefreshToken { get; set; }

        [JsonPropertyName("id_token")] 
        public string? IdToken { get; set; }

        [JsonPropertyName("token_type")] 
        public string? TokenType { get; set; }

        [JsonPropertyName("expires_in")] 
        public int? ExpiresIn { get; set; }
    }

    private class Auth0Error
    {
        [JsonPropertyName("error")] 
        public string Error { get; set; }

        [JsonPropertyName("error_description")]
        public string ErrorDescription { get; set; }
    }

    private class Auth0DeviceCodeResponseDto
    {
        [JsonPropertyName("device_code")] 
        public string DeviceCode { get; set; }

        [JsonPropertyName("user_code")] 
        public string UserCode { get; set; }

        [JsonPropertyName("verification_uri")] 
        public string VerificationUri { get; set; }

        [JsonPropertyName("verification_uri_complete")]
        public string VerificationUriComplete { get; set; }

        [JsonPropertyName("expires_in")] 
        public int ExpiresIn { get; set; }

        [JsonPropertyName("interval")] 
        public int Interval { get; set; }
    }
}