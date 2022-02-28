import { useEffect, useState } from "react";

export type useLoadAndErrorResult<T> = {
  item?: T | undefined,
  isLoading: boolean,
  error?: string | undefined
};

export function useLoadAndError<T>(load?: (() => Promise<T>) | Promise<T>) : useLoadAndErrorResult<T> {
  const [state, setState] = useState<useLoadAndErrorResult<T>>({ isLoading: true, item: undefined, error: undefined });

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!load) {
          return;
        }

        setState({ isLoading: false, item: typeof load === 'function' ? await load() : await load});
      } catch (err: any) {
        setState({ isLoading: false, error: err?.toString()});
      }
    };

    loadData();
  }, [load]);

  return state;
}

export type useLoadingAndErrorResult<TOut> = {
  items: Array<TOut>,
  isLoading: boolean,
  error: string | undefined
}

const useLoadingAndError = <TIn, TOut>(
  loadData?: (() => Promise<TIn[]>) | Promise<TIn[]>,
  transformItem?: (item: TIn) => TOut
): useLoadingAndErrorResult<TOut> => {
  const [items, setItems] = useState<TOut[] | undefined>();
  const result = useLoadAndError<TIn[]>(loadData);

  useEffect(() => {
    if (result.isLoading ||
      typeof result.error !== 'undefined' ||
      result.item == null)  {
      return;
    }

    setItems(transformItem ? result.item.map(transformItem) : result.item.map(i => i as unknown as TOut));
  }, [result, transformItem]);

  return {items: items ?? Array<TOut>(), isLoading: result.isLoading, error: result.error};
};

export default useLoadingAndError;
