using System.Threading;
using System.Threading.Tasks;
using Microsoft.Azure.SignalR.Management;

namespace Signal.Api.Common.SignalR;

internal interface ISignalRHubContextProvider
{
    Task<ServiceHubContext> GetAsync(string hubName, CancellationToken cancellationToken = default);
}