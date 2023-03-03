namespace Signal.Core.Sharing;

public class UserAssignedEntity : IUserAssignedEntity
{
    public UserAssignedEntity(string userId, string entityId)
    {
        this.UserId = userId;
        this.EntityId = entityId;
    }

    public string UserId { get; }

    public string EntityId { get; }
}