import { useEffect, useMemo, useState } from 'react';

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
  const result = useLoadAndError<TIn[]>(loadData);
  const [state, setState] = useState<useLoadingAndErrorResult<TOut>>({items: Array<TOut>(), isLoading: result.isLoading, error: result.error});

  useMemo(() => {
      const mappedResults = result.isLoading ||
      typeof result.error !== 'undefined' ||
      result.item == null
      ? []
      : (transformItem ? result.item.map(transformItem) : result.item.map(i => i as unknown as TOut));
    setState({
        items: mappedResults,
        isLoading: result.isLoading,
        error: result.error
    })
  }, [result.error, result.isLoading, result.item, transformItem]);

  return state;
};

export default useLoadingAndError;
