using System;
using System.Linq;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.IdentityModel.Tokens;

namespace Signal.Api.Common.Auth;

public static class JwtAuthenticatorExtensions
{
    /// <summary>
    /// Authenticates the user via an "Authentication: Bearer {token}" header in an HTTP request message.
    /// Returns a user principal containing claims from the token and a token that can be used to perform actions on behalf of the user.
    /// Throws an exception if the token fails to authenticate or if the Authentication header is missing or malformed.
    /// This method has an asynchronous signature, but usually completes synchronously.
    /// </summary>
    /// <param name="this">The authenticator instance.</param>
    /// <param name="request">The HTTP request.</param>
    /// <param name="cancellationToken">An optional cancellation token.</param>
    public static async Task<(ClaimsPrincipal User, SecurityToken ValidatedToken)> AuthenticateAsync(
        this IJwtAuthenticator @this,
        HttpRequestData request,
        CancellationToken cancellationToken = default)
    {
        if (!request.Headers.Contains("Authorization"))
            throw new InvalidOperationException("Authorization header is required.");

        AuthenticationHeaderValue? auth = null;
        if (request.Headers.TryGetValues("Authorization", out var authHeaders))
            auth = AuthenticationHeaderValue.Parse(authHeaders.First());
        if (auth == null || !string.Equals(auth.Scheme, "Bearer", StringComparison.InvariantCultureIgnoreCase))
            throw new InvalidOperationException("Authentication header does not use Bearer token.");
        if (auth.Parameter == null)
            throw new InvalidOperationException("Authentication header parameter is empty.");
        
        return await @this.AuthenticateAsync(auth.Parameter, cancellationToken);
    }
}