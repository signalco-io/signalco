using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.IdentityModel.Tokens;

namespace Signal.Api.Common.Auth;

public interface IJwtAuthenticator
{
    /// <summary>
    /// Authenticates the user token. Returns a user principal containing claims from the token and a token that can be used to perform actions on behalf of the user.
    /// Throws an exception if the token fails to authenticate.
    /// This method has an asynchronous signature, but usually completes synchronously.
    /// </summary>
    /// <param name="token">The token, in JWT format.</param>
    /// <param name="cancellationToken">An optional cancellation token.</param>
    Task<(ClaimsPrincipal User, SecurityToken ValidatedToken)> AuthenticateAsync(
        string token,
        CancellationToken cancellationToken = default);
}