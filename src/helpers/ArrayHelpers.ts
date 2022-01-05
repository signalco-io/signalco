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
