export const selectMany = <TArray, TItem>(array: Array<TArray>, selector: (val: TArray) => TItem[]) => {
    if (!array.length) return [];
    return array.map(selector).reduce((a, b) => {
        return a.concat(b);
    });
};

export const orderBy = <T>(array: T[], compareFn?: (a: T, b: T) => number) => {
    const copy = [...array];
    copy.sort(compareFn);
    return copy;
}

export const arraySum = <T>(array: T[], selectorFunc: (i: T, index: number) => number) => {
    if (!Array.isArray(array))
    throw new Error('Not an array: ' + typeof array);

    let sum = 0;
    for (let i = 0; i < array.length; i++) {
        sum += selectorFunc(array[i], i);
    }

    return sum;
}

const arrayPick = <T>(array: T[], compareFn: (i: T, index: number) => number, pickFn: (a: number, b: number) => boolean) => {
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

export const arrayMin = <T>(array: T[], compareFn: (i: T, index: number) => number) => arrayPick(array, compareFn, (a, b) => a < b)
export const arrayMax = <T>(array: T[], compareFn: (i: T, index: number) => number) => arrayPick(array, compareFn, (a, b) => a > b)

export const sequenceEqual = <TA, TB>(arrayA: TA[], arrayB: TB[], compareFn: (a: TA, b: TB) => boolean) => {
    if (!arrayA || !arrayB) return false;
    if (arrayA.length !== arrayB.length) return false;

    for (let i = 0; i < arrayA.length; i++) {
        if (!compareFn(arrayA[i], arrayB[i])) {
            return false;
        }
    }

    return true;
}
