export function isBoolean(valueSerialized: string | string[] | false | null | undefined) {
    if (valueSerialized == null ||
        valueSerialized === false)
        return false;

    const valueToCompare = Array.isArray(valueSerialized)
        ? valueSerialized.at(0)
        : valueSerialized;
    return valueToCompare?.toLowerCase() === 'true' ||
        valueToCompare?.toLowerCase() === 'false';
}
