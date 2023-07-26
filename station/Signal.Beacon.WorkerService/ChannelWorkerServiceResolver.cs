using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Signal.Beacon.Core.Entity;
using Signal.Beacon.Core.Workers;

namespace Signal.Beacon;

internal class ChannelWorkerServiceResolver : IChannelWorkerServiceResolver
{
    private readonly IEntitiesDao entitiesDao;
    private readonly IServiceProvider serviceProvider;

    public ChannelWorkerServiceResolver(
        IEntitiesDao entitiesDao,
        IServiceProvider serviceProvider)
    {
        this.entitiesDao = entitiesDao ?? throw new ArgumentNullException(nameof(entitiesDao));
        this.serviceProvider = serviceProvider ?? throw new ArgumentNullException(nameof(serviceProvider));
    }

    public async Task<Type?> ResolveWorkerServiceTypeAsync(string entityId, CancellationToken cancellationToken = default)
    {
        var entity = await this.entitiesDao.GetAsync(entityId, cancellationToken);
        var channelName = entity?.Contacts.FirstOrDefault(c => c.ContactName == KnownContacts.ChannelStationId)?.ChannelName;
        if (string.IsNullOrWhiteSpace(channelName))
            return null;

        var registrations = this.serviceProvider.GetServices<IWorkerServiceRegistration>();
        return registrations.FirstOrDefault(r => r.ChannelName == channelName)?.WorkerServiceType;
    }
}