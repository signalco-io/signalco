using System.Threading;

namespace Signal.Api.Common.Exceptions;

public class AnonymousRequestContextWithPayload<TPayload> : AnonymousRequestContext
{
    public TPayload Payload { get; }

    public AnonymousRequestContextWithPayload(TPayload payload, CancellationToken cancellationToken = default) : base(cancellationToken)
    {
        this.Payload = payload;
    }
}