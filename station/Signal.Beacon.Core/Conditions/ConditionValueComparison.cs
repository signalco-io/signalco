namespace Signal.Beacon.Core.Conditions;

public class ConditionValueComparison : IConditionComparable
{
    public ConditionOperation Operation { get; }
    public IConditionValue Left { get; }
    public ConditionValueOperation ValueOperation { get; }
    public IConditionValue Right { get; }

    public ConditionValueComparison(
        ConditionOperation operation,
        IConditionValue left,
        ConditionValueOperation valueOperation,
        IConditionValue right)
    {
        this.Operation = operation;
        this.Left = left;
        this.ValueOperation = valueOperation;
        this.Right = right;
    }
}