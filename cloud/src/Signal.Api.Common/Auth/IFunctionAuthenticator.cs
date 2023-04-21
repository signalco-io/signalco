using System.Threading;
using System.Threading.Tasks;
using Microsoft.Azure.Functions.Worker.Http;
using Signal.Core.Auth;

namespace Signal.Api.Common.Auth;

public interface IFunctionAuthenticator
{
    Task<IUserAuth> AuthenticateAsync(HttpRequestData request, CancellationToken cancellationToken = default);

    Task<IUserRefreshToken> RefreshTokenAsync(
        HttpRequestData request,
        string refreshToken,
        CancellationToken cancellationToken = default);

    Task<bool> AuthenticateSystemAsync(HttpRequestData req, CancellationToken cancellationToken = default);
}