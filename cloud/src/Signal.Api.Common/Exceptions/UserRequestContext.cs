using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Signal.Core.Auth;
using Signal.Core.Entities;
using Signal.Core.Exceptions;

namespace Signal.Api.Common.Exceptions;

public class UserRequestContext(IUserAuth user, CancellationToken cancellationToken = default)
    : AnonymousRequestContext(cancellationToken)
{
    public IUserAuth User { get; } = user ?? throw new ArgumentNullException(nameof(user));

    public async Task ValidateUserAssignedAsync(IEntityService entityService, string id)
    {
        if (!await entityService.IsUserAssignedAsync(this.User.UserId, id, this.CancellationToken))
            throw new ExpectedHttpException(HttpStatusCode.NotFound);
    }
}