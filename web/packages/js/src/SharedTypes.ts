export type HttpOperation = 'get' | 'post' | 'put' | 'delete' | 'trace' | 'options' | 'head' | 'patch';

export type ObjectDictAny = { [key: string]: unknown | undefined };

export type ObjectDict<T> = { [key: string]: T | undefined };

export type ValueOrFuncGeneric<T> = T | (() => T);

export type RecursivePartial<T> = {
    [P in keyof T]?:
      T[P] extends (infer U)[] ? RecursivePartial<U>[] :
      T[P] extends object ? RecursivePartial<T[P]> :
      T[P];
};

export type JsonResponse<T> = RecursivePartial<T>;

export type ParsedJson =
    | string
    | number
    | boolean
    | null
    | ParsedJson[]
    | { [key: string]: ParsedJson };

/**
 * @example
 *
 * // Example usage:
 *
 * function returnStringOrUndefined<S extends string | undefined>(value: string, defaultValue?: S):
 *     TypeOrUndefined<S, string> { ... }
 *
 * // Will return string | undefined if defaultValue is undefined, otherwise will return string
 *
 */
export type TypeOrUndefined<TVal, TType> = TVal extends TType ? TVal : TType | undefined;

export type StringOrUndefined<S> = TypeOrUndefined<S, string>;
