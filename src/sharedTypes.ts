export type ObjectDictAny = { [key: string]: any | undefined };

export type ValueOrFuncGeneric<T> = T extends any ? (T | (() => T)) : never;