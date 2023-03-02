using Signal.Beacon.Core.Entity;

namespace Signal.Beacon.Core.Conditions;

public record ConditionValueEntityState(IContactPointer? Target) : IConditionValue;