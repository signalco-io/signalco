namespace Signal.Core.Sharing;

public interface IUserAssignedEntity
{
    string UserId { get; }

    string EntityId { get; }
}