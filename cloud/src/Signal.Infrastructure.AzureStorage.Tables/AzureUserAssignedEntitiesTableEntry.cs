using Signal.Core.Sharing;

namespace Signal.Infrastructure.AzureStorage.Tables;

internal class AzureUserAssignedEntitiesTableEntry : AzureTableEntityBase
{
    public AzureUserAssignedEntitiesTableEntry() : base(string.Empty, string.Empty)
    {
    }

    protected AzureUserAssignedEntitiesTableEntry(string entityId, string userId) : base(entityId, userId)
    {
    }

    public static AzureUserAssignedEntitiesTableEntry From(IUserAssignedEntity assigned) =>
        new(assigned.UserId, assigned.EntityId);

    public static IUserAssignedEntity To(AzureUserAssignedEntitiesTableEntry assigned) =>
        new UserAssignedEntity(assigned.PartitionKey, assigned.RowKey);
}