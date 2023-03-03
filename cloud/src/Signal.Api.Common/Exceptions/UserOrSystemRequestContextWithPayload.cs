using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Signal.Core.Auth;
using Signal.Core.Entities;
using Signal.Core.Exceptions;

namespace Signal.Api.Common.Exceptions;

public class UserOrSystemRequestContextWithPayload<TPayload> : AnonymousRequestContext
{
    public TPayload Payload { get; }

    public IUserAuth? User { get; }

    public bool IsSystem { get; }

    public UserOrSystemRequestContextWithPayload(IUserAuth? user, TPayload payload, CancellationToken cancellationToken = default) : base(cancellationToken)
    {
        this.Payload = payload;
        this.User = user;
    }

    public UserOrSystemRequestContextWithPayload(bool isSystem, TPayload payload, CancellationToken cancellationToken = default) : base(cancellationToken)
    {
        this.Payload = payload;
        this.IsSystem = isSystem;
    }

    public async Task ValidateUserAssignedAsync(IEntityService entityService, string id)
    {
        // Allow all entities
        if (this.IsSystem)
            return;

        if (!await entityService.IsUserAssignedAsync(
                this.User?.UserId ?? throw new ExpectedHttpException(HttpStatusCode.NotFound),
                id,
                this.CancellationToken))
            throw new ExpectedHttpException(HttpStatusCode.NotFound);
    }
}