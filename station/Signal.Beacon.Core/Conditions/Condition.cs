using System.Collections.Generic;

namespace Signal.Beacon.Core.Conditions;

public class Condition : IConditionComparable
{
    public ConditionOperation Operation { get; }

    public IEnumerable<IConditionComparable> Operations { get; }

    public Condition(ConditionOperation operation, IEnumerable<IConditionComparable> operations)
    {
        this.Operation = operation;
        this.Operations = operations;
    }
}