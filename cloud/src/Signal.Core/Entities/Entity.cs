namespace Signal.Core.Entities;

public class Entity : IEntity
{
    public Entity(EntityType type, string id, string? alias)
    {
        this.Type = type;
        this.Id = id;
        this.Alias = alias ?? id;
    }

    public EntityType Type { get; }

    public string Id { get; }
    
    public string Alias { get; }
}
