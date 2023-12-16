namespace Signal.Core.Sharing;

public class UserAssignedEntity(string userId, string entityId) : IUserAssignedEntity
{
    public string UserId { get; } = userId;

    public string EntityId { get; } = entityId;
}