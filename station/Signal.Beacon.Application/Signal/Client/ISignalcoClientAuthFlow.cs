using System;
using System.Threading;
using System.Threading.Tasks;
using Signal.Beacon.Application.Auth;

namespace Signal.Beacon.Application.Signal.Client;

public interface ISignalcoClientAuthFlow
{
    void AssignToken(AuthToken token);

    Task<AuthToken?> GetTokenAsync(CancellationToken cancellationToken);

    event EventHandler<AuthToken?> OnTokenRefreshed;
}