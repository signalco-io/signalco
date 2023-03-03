using System.Threading;
using System.Threading.Tasks;
using Signal.Core.Contacts;

namespace Signal.Core.Processor;

public interface IProcessManager
{
    Task AddAsync(IContactPointer pointer, CancellationToken cancellationToken = default);

    Task FromQueueAsync(IContactPointer pointer, CancellationToken cancellationToken = default);
    
    Task LinkContactProcessTriggers(
        IContactPointer pointer, 
        CancellationToken cancellationToken = default);
}