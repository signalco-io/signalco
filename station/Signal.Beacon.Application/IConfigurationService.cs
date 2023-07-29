using System.Threading;
using System.Threading.Tasks;

namespace Signal.Beacon.Application;

public interface IConfigurationService
{
    Task<T> LoadAsync<T>(string name, CancellationToken cancellationToken) where T : new();
        
    Task SaveAsync<T>(string name, T config, CancellationToken cancellationToken);
}