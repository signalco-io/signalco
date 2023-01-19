/** @public */
export type ChildrenProps = { children?: React.ReactNode | undefined };

export type ObjectDictAny = { [key: string]: any | undefined };

export type ObjectDict<T> = { [key: string]: T | undefined };

export type ValueOrFuncGeneric<T> = T | (() => T);

export type RecursivePartial<T> = {
    [P in keyof T]?:
      T[P] extends (infer U)[] ? RecursivePartial<U>[] :
      T[P] extends object ? RecursivePartial<T[P]> :
      T[P];
};

export type JsonResponse<T> = RecursivePartial<T>;
