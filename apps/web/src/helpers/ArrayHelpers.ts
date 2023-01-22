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

const arrayPick = <T>(array: T[], compareFn: (i: T, index: number) => number | undefined, pickFn: (a: number | undefined, b: number | undefined) => boolean) => {
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

export const arrayMin = <T>(array: T[], compareFn: (i: T, index: number) => number | undefined) => arrayPick(array, compareFn, (a, b) => typeof a === 'undefined' ? true : a < (typeof b === 'undefined' ? false : b))
export const arrayMax = <T>(array: T[], compareFn: (i: T, index: number) => number | undefined) => arrayPick(array, compareFn, (a, b) => typeof a === 'undefined' ? false : a > (typeof b === 'undefined' ? true : b))
