using System.Threading;
using System.Threading.Tasks;
using Signal.Core.Contacts;

namespace Signal.Core.Processor;

public interface IProcessManager
{
    Task AddAsync(IContactPointer pointer, CancellationToken cancellationToken = default);

    Task AddManualAsync(string processEntityId, CancellationToken cancellationToken = default);

    Task FromQueueAsync(string processEntityId, CancellationToken cancellationToken = default);

    Task LinkContactProcessTriggers(
        IContactPointer pointer,
        CancellationToken cancellationToken = default);
}