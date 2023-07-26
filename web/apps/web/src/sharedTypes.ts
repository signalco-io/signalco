export type ObjectDictAny = { [key: string]: unknown | undefined };

export type ObjectDict<T> = { [key: string]: T | undefined };

export type ValueOrFuncGeneric<T> = T | (() => T);
