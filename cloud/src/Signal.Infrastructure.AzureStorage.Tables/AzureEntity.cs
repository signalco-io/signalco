using System;
using Signal.Core.Entities;

namespace Signal.Infrastructure.AzureStorage.Tables;

[Serializable]
internal class AzureEntity : AzureTableEntityBase
{
    public string? Alias { get; set; }

    public AzureEntity() : base(string.Empty, string.Empty)
    {
    }

    protected AzureEntity(EntityType type, string id) : base(type.ToString(), id)
    {
    }

    public static AzureEntity From(IEntity entity)
    {
        return new AzureEntity(entity.Type, entity.Id)
        {
            Alias = entity.Alias
        };
    }

    public static IEntity ToEntity(AzureEntity entity)
    {
        if (!Enum.TryParse<EntityType>(entity.PartitionKey, out var type))
            throw new ArgumentException("Type unknown.");

        return new Entity(type, entity.RowKey, entity.Alias);
    }
}