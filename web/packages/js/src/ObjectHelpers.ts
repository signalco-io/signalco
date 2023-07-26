export function objectWithKey<T extends object | unknown>(obj: T, key: string) {
    if (typeof obj === 'object' && obj !== null && key in obj) {
        return obj as T & { [key: string]: unknown };
    }
    return undefined;
}
