import { useEffect, useMemo, useRef, useState, useTransition } from 'react';
import { ValueOrFuncGeneric } from '../sharedTypes';

export type useLoadAndErrorResult<T> = {
  item?: T | undefined,
  isLoading: boolean,
  error?: string | undefined
};

export function useLoadAndError<T>(load?: ValueOrFuncGeneric<Promise<T> | undefined>) : useLoadAndErrorResult<T> {
  const [state, setState] = useState<useLoadAndErrorResult<T>>({ isLoading: true, item: undefined, error: undefined });
  const [isPending, startTransition] = useTransition();
  const loadPromiseRef = useRef<Promise<T>>();

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!load || loadPromiseRef.current) {
          return;
        }

        loadPromiseRef.current = typeof load === 'function' ? load() : load;
        const item = await loadPromiseRef.current;

        startTransition(() => {
            setState({ isLoading: false, item: item});
            loadPromiseRef.current = undefined;
        });
      } catch (err: any) {
        setState({ isLoading: false, error: err?.toString()});
        loadPromiseRef.current = undefined;
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

  useEffect(() => {
      const mappedResults = result.isLoading ||
      typeof result.error !== 'undefined' ||
      result.item == null
      ? []
      : (transformItem ? result.item.map(transformItem) : result.item.map(i => i as unknown as TOut));

    setState({
        items: mappedResults,
        isLoading: result.isLoading,
        error: result.error
    });
  }, [result.error, result.isLoading, result.item, transformItem]);

  return state;
};

export default useLoadingAndError;
