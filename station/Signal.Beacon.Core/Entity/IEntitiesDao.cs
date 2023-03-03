using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Signal.Beacon.Core.Entity;

public interface IEntitiesDao
{
    Task<IEntityDetails?> GetAsync(string id, CancellationToken cancellationToken = default);

    Task<IEntityDetails?> GetByAliasAsync(string alias, CancellationToken cancellationToken = default);

    Task<IEnumerable<IEntityDetails>> AllAsync(CancellationToken cancellationToken = default);
    
    void InvalidateEntity(string id);

    Task<string?> ContactValueSerializedAsync(IContactPointer pointer, CancellationToken cancellationToken = default);

    Task<IEnumerable<IEntityDetails>> GetByContactValueAsync(
        string channelName, 
        string contactName,
        string? contactValueSerialized, 
        CancellationToken cancellationToken = default);
}