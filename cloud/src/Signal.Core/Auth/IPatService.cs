using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Signal.Core.Auth;

public interface IPatService
{
    Task VerifyAsync(string userId, string pat, CancellationToken cancellationToken = default);

    Task<IEnumerable<IPat>> GetAllAsync(string userId, CancellationToken cancellationToken = default);

    Task<string> CreateAsync(IPatCreate patCreate, CancellationToken cancellationToken = default);
}