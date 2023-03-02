using System.Threading;
using System.Threading.Tasks;

namespace Signal.Beacon.Core.Conditions;

public interface IConditionEvaluatorService
{
    Task<bool> IsConditionMetAsync(IConditionComparable? comparable, CancellationToken cancellationToken);
}