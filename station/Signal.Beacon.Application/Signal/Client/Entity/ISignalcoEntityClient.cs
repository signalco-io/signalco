using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Signal.Beacon.Core.Entity;
using Signal.Beacon.Core.Signal;

namespace Signal.Beacon.Application.Signal.Client.Entity;

internal interface ISignalcoEntityClient : ISignalFeatureClient
{
    Task<string> UpsertAsync(EntityUpsertCommand command, CancellationToken cancellationToken);
    
    Task<IEnumerable<IEntityDetails>> AllAsync(CancellationToken cancellationToken);

    Task DeleteAsync(string entityId, CancellationToken cancellationToken);
    Task<IEntityDetails> GetAsync(string id, CancellationToken cancellationToken = default);
}