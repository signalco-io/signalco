using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Signal.Core.Auth;

namespace Signal.Api.Common.Auth;

public interface IFunctionAuthenticator
{
    Task<IUserAuth> AuthenticateAsync(HttpRequest request, CancellationToken cancellationToken = default);

    Task<IUserRefreshToken> RefreshTokenAsync(
        HttpRequest request,
        string refreshToken,
        CancellationToken cancellationToken = default);

    Task<bool> AuthenticateSystemAsync(HttpRequest req, CancellationToken cancellationToken = default);
}