namespace Signal.Core.Entities;

public class Entity(EntityType type, string id, string? alias) : IEntity
{
    public EntityType Type { get; } = type;

    public string Id { get; } = id;

    public string Alias { get; } = alias ?? id;
}
