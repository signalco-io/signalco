namespace Signalco.Infrastructure.Processor.Configuration.Schemas;

public class JsonConductConverter : JsonTypesFactoryConverter<Conduct>
{
    protected override IReadOnlyDictionary<string, Type> Map { get; } = new Dictionary<string, Type>
    {
        {"contact", typeof(ConductEntityContact)}
    };
}