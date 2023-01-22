export function isBoolean(valueSerialized: string | (string | number | { [key: string]: string | number })[] | number | false | null | undefined) {
    if (valueSerialized == null ||
        valueSerialized === false)
        return false;

    const valueToCompare = Array.isArray(valueSerialized)
        ? valueSerialized.at(0)
        : valueSerialized;
    return valueToCompare?.toString().toLowerCase() === 'true' ||
        valueToCompare?.toString().toLowerCase() === 'false';
}
