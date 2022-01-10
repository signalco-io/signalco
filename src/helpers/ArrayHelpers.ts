export const selectMany = <TArray, TItem>(array: Array<TArray>, selector: (val: TArray) => TItem[]) => {
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

export const arrayMax = <T>(array: T[], compareFn: (i: T, index: number) => number) => {
    if (!Array.isArray(array))
        throw new Error('Not an array: ' + typeof array);

    let currentMax = compareFn(array[0], 0);
    for (let i = 1; i < array.length; i++) {
        const curr = compareFn(array[i], i);
        if (curr > currentMax) {
            currentMax = curr;
        }
    }

    return currentMax;
}

export const sequenceEqual = <TA, TB>(arrayA: TA[], arrayB: TB[], compareFn: (a: TA, b: TB) => boolean) => {
    if (!arrayA || !arrayB) return false;
    if (arrayA.length !== arrayB.length) return false;

    for (let i = 0; i < arrayA.length; i++) {
        const a = arrayA[i];
        const b = arrayB[i];
        if (!compareFn(a, b)) {
            return false;
        }
    }

    return true;
}
