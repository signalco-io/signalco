using System.Threading;
using System.Threading.Tasks;

namespace Signal.Beacon.Core.Configuration;

public interface IChannelConfigurationService
{
    Task<T> LoadAsync<T>(string entityId, string channelName, CancellationToken cancellationToken = default) where T: new();

    Task SaveAsync<T>(string entityId, string channelName, T value, CancellationToken cancellationToken = default);
}