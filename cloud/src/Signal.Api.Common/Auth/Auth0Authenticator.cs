using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.IdentityModel.Protocols;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using Microsoft.IdentityModel.Tokens;
using Signal.Core.Secrets;

namespace Signal.Api.Common.Auth;

/// <summary>
/// A type that authenticates users against an Auth0 account.
/// </summary>
public sealed class Auth0Authenticator : IJwtAuthenticator
{
    private readonly ISecretsProvider secretsProvider;
    private readonly TokenValidationParameters parameters;
    private readonly ConfigurationManager<OpenIdConnectConfiguration> manager;
    private readonly JwtSecurityTokenHandler handler;

    public Auth0Authenticator(string auth0Domain, IEnumerable<string> audiences, bool allowExpired, ISecretsProvider secretsProvider)
    {
        this.secretsProvider = secretsProvider;
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

    public async Task<(ClaimsPrincipal User, SecurityToken ValidatedToken)> AuthenticateAsync(
        string token,
        CancellationToken cancellationToken = default)
    {
        if (this.handler.ReadJwtToken(token).Issuer == "https://api.signalco.io/") // Same as in PatService (where PAT is created)
        {
            // TODO: Optimize by caching these parameters (not changing)
            var patParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                    await this.secretsProvider.GetSecretAsync(SecretKeys.PatSigningToken, cancellationToken))),
                ValidateAudience = false,
                ValidIssuer = "https://api.signalco.io/"
            };
            var user = this.handler.ValidateToken(token, patParameters, out var validatedToken);
            return (user, validatedToken);
        }
        else
        {
            // Note: ConfigurationManager<T> has an automatic refresh interval of 1 day.
            //   The config is cached in-between refreshes, so this "asynchronous" call actually completes synchronously unless it needs to refresh.
            var auth0Config = await this.manager.GetConfigurationAsync(cancellationToken);
            this.parameters.IssuerSigningKeys = auth0Config.SigningKeys;
            var user = this.handler.ValidateToken(token, this.parameters, out var validatedToken);
            return (user, validatedToken);
        }
    }
}