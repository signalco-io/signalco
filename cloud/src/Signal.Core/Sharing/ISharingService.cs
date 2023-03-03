using System.Threading;
using System.Threading.Tasks;

namespace Signal.Core.Sharing;

public interface ISharingService
{
    Task AssignToUserAsync(string userId, string entityId, CancellationToken cancellationToken = default);

    Task AssignToUserEmailAsync(
        string userEmail, 
        string entityId,
        CancellationToken cancellationToken = default);

    Task UnAssignFromUserEmailAsync(string userEmail, string entityId, CancellationToken cancellationToken = default);

    Task UnAssignFromUserAsync(string userId, string entityId, CancellationToken cancellationToken = default);
}