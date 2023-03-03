using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.IdentityModel.Protocols;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using Microsoft.IdentityModel.Tokens;

namespace Signal.Api.Common.Auth;

/// <summary>
/// A type that authenticates users against an Auth0 account.
/// </summary>
public sealed class Auth0Authenticator : IJwtAuthenticator
{
    private readonly TokenValidationParameters parameters;
    private readonly ConfigurationManager<OpenIdConnectConfiguration> manager;
    private readonly JwtSecurityTokenHandler handler;

    /// <summary>
    /// Creates a new authenticator. In most cases, you should only have one authenticator instance in your application.
    /// </summary>
    /// <param name="auth0Domain">The domain of the Auth0 account, e.g., <c>"myauth0test.auth0.com"</c>.</param>
    /// <param name="audiences">The valid audiences for tokens. This must include the "audience" of the access_token request, and may also include a "client id" to enable id_tokens from clients you own.</param>
    /// <param name="allowExpired">Set to <c>True</c> to disable token lifetime validation; should be almost always <c>False</c>. In case of validating token when refreshing access token - set to <c>true</c>.</param>
    public Auth0Authenticator(string auth0Domain, IEnumerable<string> audiences, bool allowExpired)
    {
        this.manager = new ConfigurationManager<OpenIdConnectConfiguration>(
            $"https://{auth0Domain}/.well-known/openid-configuration",
            new OpenIdConnectConfigurationRetriever());
        this.parameters = new TokenValidationParameters
        {
            ValidIssuer = $"https://{auth0Domain}/",
            ValidAudiences = audiences.ToArray(),
            ValidateIssuerSigningKey = true,
            ValidateLifetime = !allowExpired
        };
        this.handler = new JwtSecurityTokenHandler();
    }

    /// <summary>
    /// Authenticates the user token. Returns a user principal containing claims from the token and a token that can be used to perform actions on behalf of the user.
    /// Throws an exception if the token fails to authenticate.
    /// This method has an asynchronous signature, but usually completes synchronously.
    /// </summary>
    /// <param name="token">The token, in JWT format.</param>
    /// <param name="cancellationToken">An optional cancellation token.</param>
    public async Task<(ClaimsPrincipal User, SecurityToken ValidatedToken)> AuthenticateAsync(
        string token,
        CancellationToken cancellationToken = default)
    {
        // Note: ConfigurationManager<T> has an automatic refresh interval of 1 day.
        //   The config is cached in-between refreshes, so this "asynchronous" call actually completes synchronously unless it needs to refresh.
        var config = await this.manager.GetConfigurationAsync(cancellationToken);
        this.parameters.IssuerSigningKeys = config.SigningKeys;
        var user = this.handler.ValidateToken(token, this.parameters, out var validatedToken);
        return (user, validatedToken);
    }
}