using System.Threading;
using System.Threading.Tasks;

namespace Signal.Core.Secrets;

public interface ISecretsProvider
{
    Task<string> GetSecretAsync(string key, CancellationToken cancellationToken = default);
}