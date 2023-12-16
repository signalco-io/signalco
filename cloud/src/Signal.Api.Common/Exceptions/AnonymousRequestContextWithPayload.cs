using System.Threading;

namespace Signal.Api.Common.Exceptions;

public class AnonymousRequestContextWithPayload<TPayload>(
        TPayload payload,
        CancellationToken cancellationToken = default)
    : AnonymousRequestContext(cancellationToken)
{
    public TPayload Payload { get; } = payload;
}