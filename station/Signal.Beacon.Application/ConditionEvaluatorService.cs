using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Signal.Beacon.Core.Conditions;

namespace Signal.Beacon.Application;

public class ConditionEvaluatorService : IConditionEvaluatorService
{
    private readonly IConditionEvaluatorValueProvider valueProvider;

    public ConditionEvaluatorService(
        IConditionEvaluatorValueProvider valueProvider)
    {
        this.valueProvider = valueProvider;
    }

    public async Task<bool> IsConditionMetAsync(IConditionComparable? comparable, CancellationToken cancellationToken)
    {
        if (comparable == null) 
            return true;

        switch (comparable)
        {
            case ConditionValueComparison conditionValueComparison:
            {
                var left = this.valueProvider.GetValueAsync(conditionValueComparison.Left, cancellationToken);
                var right = this.valueProvider.GetValueAsync(conditionValueComparison.Right, cancellationToken);
                await Task.WhenAll(left, right);
                var leftResult = left.Result;
                var rightResult = right.Result;
                return conditionValueComparison.ValueOperation switch
                {
                    ConditionValueOperation.Equal => leftResult == rightResult || leftResult != null && leftResult.Equals(rightResult),
                    ConditionValueOperation.EqualOrNull => leftResult == rightResult || leftResult != null && leftResult.Equals(rightResult) || leftResult == null && rightResult != null || leftResult != null && rightResult == null,
                    ConditionValueOperation.GreaterThan => OperationGreaterThan(leftResult, rightResult),
                    ConditionValueOperation.LessThan => OperationLessThan(leftResult, rightResult),
                    _ => throw new NotSupportedException($"Not supported value provider: {conditionValueComparison.ValueOperation}")
                };
            }
            case Condition condition:
            {
                bool? result = null;
                var conditionOperations = condition.Operations.ToList();
                var orOperationsLeft = conditionOperations.Count(o => o.Operation == ConditionOperation.Or);
                foreach (var operation in conditionOperations)
                {
                    var operationResult = await this.IsConditionMetAsync(operation, cancellationToken);
                    if (result == null)
                    {
                        result = operationResult;
                        continue;
                    }

                    switch (operation.Operation)
                    {
                        case ConditionOperation.Result:
                            result = operationResult;
                            break;
                        case ConditionOperation.Or when operationResult || result == true:
                            // Return as soon first OR conditions returns true
                            return true;
                        case ConditionOperation.Or:
                            // Reset result if until now we have not evaluated to true
                            orOperationsLeft--;
                            if (orOperationsLeft <= 0 && operationResult == false)
                                return false;
                            result = null;
                            break;
                        case ConditionOperation.And:
                            // Return false if we evaluated to false and there is not OR operations further
                            result &= operationResult;
                            if (orOperationsLeft <= 0 && operationResult == false)
                                return false;
                            break;
                        case ConditionOperation.Xor:
                            result ^= operationResult;
                            break;
                        default:
                            throw new NotSupportedException($"Not supported value operation: {operation.Operation}");
                    }
                }

                return result ?? throw new Exception("Condition evaluation failed. Result is null.");
            }
            default:
                throw new NotSupportedException($"Not supported condition comparison: {comparable?.GetType().FullName ?? "Comparable is null"}");
        }
    }

    private static bool OperationLessThan(object? leftResult, object? rightResult)
    {
        if (double.TryParse(leftResult?.ToString(), out var leftNum) &&
            double.TryParse(rightResult?.ToString(), out var rightNum))
            return leftNum < rightNum;
        return false;
    }

    private static bool OperationGreaterThan(object? leftResult, object? rightResult)
    {
        if (double.TryParse(leftResult?.ToString(), out var leftNum) &&
            double.TryParse(rightResult?.ToString(), out var rightNum))
            return leftNum > rightNum;
        return false;
    }
}