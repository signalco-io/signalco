namespace Signal.Core.Entities;

public interface IEntity
{
    public EntityType Type { get; }

    public string Id { get; }
    
    public string Alias { get; }
}