export type ChildrenProps = { children?: React.ReactNode | undefined };

export type ObjectDictAny = { [key: string]: any | undefined };

export type ObjectDict<T> = { [key: string]: T | undefined };

export type ValueOrFuncGeneric<T> = T | (() => T);
