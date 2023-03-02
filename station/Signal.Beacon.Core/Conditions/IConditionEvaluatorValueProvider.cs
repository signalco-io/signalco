using System.Threading;
using System.Threading.Tasks;

namespace Signal.Beacon.Core.Conditions;

public interface IConditionEvaluatorValueProvider
{
    Task<string?> GetValueAsync(IConditionValue conditionValue, CancellationToken cancellationToken);
}