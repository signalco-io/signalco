using System.Threading;
using Signal.Core.Auth;

namespace Signal.Api.Common.Exceptions;

public class UserRequestContextWithPayload<TPayload>(
        IUserAuth user, 
        TPayload payload,
        CancellationToken cancellationToken = default)
    : UserRequestContext(user, cancellationToken)
{
    public TPayload Payload { get; } = payload;
}