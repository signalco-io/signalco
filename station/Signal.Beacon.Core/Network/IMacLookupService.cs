using System.Threading;
using System.Threading.Tasks;

namespace Signal.Beacon.Core.Network;

public interface IMacLookupService
{
    Task<string?> CompanyNameLookupAsync(string physicalAddress, CancellationToken cancellationToken);
}