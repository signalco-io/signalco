using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Signal.Core.Users;

public interface IUserService
{
    Task<IUserPublic?> GetPublicAsync(string userId, CancellationToken cancellationToken = default);

    Task<IEnumerable<IUserPublic>> GetPublicAsync(
        IEnumerable<string> userIds,
        CancellationToken cancellationToken = default);

    Task<string?> IdByEmailAsync(string email, CancellationToken cancellationToken = default);

    // TODO: Add user register
}