using System.Threading;
using System.Threading.Tasks;

namespace Signal.Beacon.Core.Entity;

public interface IEntityService
{
    Task<string> UpsertAsync(
        EntityType type,
        string? id,
        string alias,
        CancellationToken cancellationToken = default);

    Task ContactSetAsync(
        IContactPointer pointer,
        string? value,
        CancellationToken cancellationToken = default);
}