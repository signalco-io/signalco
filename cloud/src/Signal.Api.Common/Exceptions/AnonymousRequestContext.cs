using System.Threading;

namespace Signal.Api.Common.Exceptions;

public class AnonymousRequestContext(CancellationToken cancellationToken = default)
{
    public CancellationToken CancellationToken { get; } = cancellationToken;
}