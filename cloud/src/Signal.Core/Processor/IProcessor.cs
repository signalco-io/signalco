using Signal.Core.Contacts;
using System.Threading;
using System.Threading.Tasks;

namespace Signal.Core.Processor;

public interface IProcessor
{
    Task RunProcessAsync(
        string processEntityId, 
        IContactPointer trigger, 
        bool instant,
        CancellationToken cancellationToken = default);
}