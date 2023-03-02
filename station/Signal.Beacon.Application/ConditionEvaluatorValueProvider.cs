using System;
using System.Threading;
using System.Threading.Tasks;
using Signal.Beacon.Core.Conditions;
using Signal.Beacon.Core.Entity;

namespace Signal.Beacon.Application;

public class ConditionEvaluatorValueProvider : IConditionEvaluatorValueProvider
{
    private readonly IEntitiesDao entitiesDao;

    public ConditionEvaluatorValueProvider(
        IEntitiesDao entitiesDao)
    {
        this.entitiesDao = entitiesDao ?? throw new ArgumentNullException(nameof(entitiesDao));
    }

    public async Task<string?> GetValueAsync(IConditionValue conditionValue, CancellationToken cancellationToken)
    {
        return conditionValue switch
        {
            ConditionValueStatic conditionValueStatic => conditionValueStatic.ValueSerialized,
            ConditionValueEntityState conditionValueDeviceState => conditionValueDeviceState.Target == null
                ? null
                : await this.entitiesDao.ContactValueSerializedAsync(conditionValueDeviceState.Target, cancellationToken),
            _ => throw new NotSupportedException(
                $"Not supported condition value comparison: {conditionValue.GetType().FullName}")
        };
    }
}