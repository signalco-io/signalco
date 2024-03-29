﻿using Signal.Core.Contacts;
using Signalco.Infrastructure.Processor.Configuration.Schemas;
using ContactPointer = Signal.Core.Contacts.ContactPointer;

namespace Signalco.Infrastructure.Processor;

internal static class ConditionsHelper
{
    public static bool ShouldTrigger(IEnumerable<Condition> conditions, IContactPointer trigger)
    {
        // Should trigger if any of following is met:
        // - no conditions
        // - conditions contains trigger pointer

        var conditionsList = conditions.ToList();
        return !conditionsList.Any() || 
               ExtractPointers(conditionsList).Any(ipt => ipt?.Equals(trigger) ?? false);
    }

    public static IEnumerable<IContactPointer?> ExtractPointers(IEnumerable<Condition> conditions) =>
        conditions.SelectMany(ExtractPointers);

    private static IEnumerable<IContactPointer?> ExtractPointers(Condition? condition) =>
        condition switch
        {
            ConditionCompare c => ExtractPointers(c),
            ConditionContact c => ExtractPointers(c),
            ConditionOrGroup c => ExtractPointers(c),
            _ => Enumerable.Empty<IContactPointer?>()
        };

    private static IEnumerable<IContactPointer?> ExtractPointers(ConditionCompare condition) =>
        ExtractPointers(condition.Left).Union(ExtractPointers(condition.Right));

    private static IEnumerable<IContactPointer?> ExtractPointers(ConditionOrGroup condition) =>
        condition.Conditions?.SelectMany(ExtractPointers) ?? Enumerable.Empty<IContactPointer?>();

    private static IEnumerable<IContactPointer?> ExtractPointers(ConditionContact condition) =>
        condition.ContactPointer is { EntityId: { }, ChannelName: { }, ContactName: { } }
            ? new[]
            {
                new ContactPointer(
                    condition.ContactPointer.EntityId,
                    condition.ContactPointer.ChannelName,
                    condition.ContactPointer.ContactName)
            }
            : Enumerable.Empty<IContactPointer?>();
}