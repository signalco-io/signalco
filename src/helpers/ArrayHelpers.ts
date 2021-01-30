export const selectMany = <TArray, TItem>(array: Array<TArray>, selector: (val: TArray) => TItem[]) => {
    return array.map(selector).reduce((a, b) => {
        return a.concat(b);
    });
};