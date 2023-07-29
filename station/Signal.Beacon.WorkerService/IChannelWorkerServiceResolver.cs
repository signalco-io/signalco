using System;
using System.Threading;
using System.Threading.Tasks;

namespace Signal.Beacon;

internal interface IChannelWorkerServiceResolver
{
    Task<Type?> ResolveWorkerServiceTypeAsync(string entityId, CancellationToken cancellationToken = default);
}