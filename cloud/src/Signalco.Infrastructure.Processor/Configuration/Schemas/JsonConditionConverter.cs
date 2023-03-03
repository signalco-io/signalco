namespace Signalco.Infrastructure.Processor.Configuration.Schemas;

public class JsonConditionConverter : JsonTypeFactoryConverter<Condition>
{
    protected override IReadOnlyDictionary<string, Type> Map { get; } = new Dictionary<string, Type>
    {
        {"value", typeof(ConditionConst)},
        {"contact", typeof(ConditionContact)},
        {"orGroup", typeof(ConditionOrGroup)},
        {"compare", typeof(ConditionCompare)},
    };
}