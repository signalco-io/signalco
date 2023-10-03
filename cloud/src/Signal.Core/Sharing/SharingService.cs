using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Signal.Core.Storage;
using Signal.Core.Users;

namespace Signal.Core.Sharing;

public class SharingService(
        IAzureStorage azureStorage,
        IUserService userService,
        ILogger<SharingService> logger)
    : ISharingService
{
    public async Task AssignToUserEmailAsync(
        string userEmail, 
        string entityId,
        CancellationToken cancellationToken = default)
    {
        var sanitizedEmail = userEmail.Trim().ToLowerInvariant();
        var userId = await userService.IdByEmailAsync(sanitizedEmail, cancellationToken);
        if (!string.IsNullOrWhiteSpace(userId))
            await this.AssignToUserAsync(userId, entityId, cancellationToken);
        else logger.LogWarning("Unknown user email {UserEmail}. Didn't assign entity {EntityId}", userEmail, entityId);
    }

    public async Task UnAssignFromUserEmailAsync(string userEmail, string entityId, CancellationToken cancellationToken = default)
    {
        var sanitizedEmail = userEmail.Trim().ToLowerInvariant();
        var userId = await userService.IdByEmailAsync(sanitizedEmail, cancellationToken);
        if (!string.IsNullOrWhiteSpace(userId))
            await this.UnAssignFromUserAsync(userId, entityId, cancellationToken);
        else logger.LogWarning("Unknown user email {UserEmail}. Didn't assign entity {EntityId}", userEmail, entityId);
    }

    public async Task AssignToUserAsync(string userId, string entityId, CancellationToken cancellationToken = default)
    {
        // TODO: Check if entity exists
        // TODO: Check if current user has rights to assign self or others to provided entity

        await azureStorage.UpsertAsync(
            new UserAssignedEntity(userId, entityId), cancellationToken);
    }

    public Task UnAssignFromUserAsync(string userId, string entityId, CancellationToken cancellationToken = default)
    {
        // TODO: Clear links and caches (eg. Contact<>Process links as user is no longer authorized for all entities in process)
        // TODO: Check if current user has rights to un-assign others to provided entity (can always un-assign self)
        return azureStorage.RemoveAsync(new UserAssignedEntity(userId, entityId), cancellationToken);
    }
}