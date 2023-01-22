export function selectMany<TArray, TItem>(array: Array<TArray>, selector: (val: TArray) => TItem[]) {
    if (!array.length)
        return [];
    return array.map(selector).reduce((a, b) => {
        return a.concat(b);
    });
}

export function orderBy<T>(array: T[], compareFn?: (a: T, b: T) => number) {
    const copy = [...array];
    copy.sort(compareFn);
    return copy;
}

export function arraySum<T>(array: T[], selectorFunc: (i: T, index: number) => number) {
    if (!Array.isArray(array))
        throw new Error('Not an array: ' + typeof array);

    let sum = 0;
    for (let i = 0; i < array.length; i++) {
        sum += selectorFunc(array[i], i);
    }

    return sum;
}

function arrayPick<T>(array: T[], compareFn: (i: T, index: number) => number | undefined, pickFn: (a: number | undefined, b: number | undefined) => boolean) {
    if (!Array.isArray(array))
        throw new Error('Not an array: ' + typeof array);

    if (array.length <= 0)
        return undefined;

    let currentMin = compareFn(array[0], 0);
    for (let i = 1; i < array.length; i++) {
        const curr = compareFn(array[i], i);
        if (pickFn(curr, currentMin)) {
            currentMin = curr;
        }
    }

    return currentMin;
}

export function arrayMin<T>(array: T[], compareFn: (i: T, index: number) => number | undefined) {
    return arrayPick(array, compareFn, (a, b) => typeof a === 'undefined' ? true : a < (typeof b === 'undefined' ? false : b));
}
export function arrayMax<T>(array: T[], compareFn: (i: T, index: number) => number | undefined) {
    return arrayPick(array, compareFn, (a, b) => typeof a === 'undefined' ? false : a > (typeof b === 'undefined' ? true : b));
}

export function sequenceEqual<TA, TB>(arrayA: TA[], arrayB: TB[], compareFn?: (a: TA, b: TB) => boolean) {
    if (!arrayA || !arrayB)
        return false;
    if (arrayA.length !== arrayB.length)
        return false;

    for (let i = 0; i < arrayA.length; i++) {
        if ((compareFn && !compareFn(arrayA[i], arrayB[i])) ||
            Object.is(arrayA[i], arrayB[i])) {
            return false;
        }
    }

    return true;
}

export function asArray<T>(value: T | T[] | undefined): T[] {
    return typeof value === 'undefined'
        ? []
        : (Array.isArray(value) ? value : [value]);
}
