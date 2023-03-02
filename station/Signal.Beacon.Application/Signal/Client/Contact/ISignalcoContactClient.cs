using System.Threading;
using System.Threading.Tasks;
using Signal.Beacon.Core.Signal;

namespace Signal.Beacon.Application.Signal.Client.Contact;

internal interface ISignalcoContactClient : ISignalFeatureClient
{
    Task UpsertAsync(ContactUpsertCommand command, CancellationToken cancellationToken = default);
}