import { useEffect, useState } from "react";

const useLoadingAndError = <TIn, TOut>(
  loadData?: (() => Promise<TIn[]>) | Promise<TIn[]>,
  transformItem?: (item: TIn) => TOut
): {items: Array<TOut>, isLoading: boolean, error: string | undefined} => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);
  const [items, setItems] = useState<Array<TOut> | undefined>(undefined);

  useEffect(() => {
    const loadDataAsync = async () => {
      try {
        if (!loadData) 
          return;
        console.debug("Loading table data...")
        const items = typeof loadData === 'function' ? await loadData() : await loadData;
        setItems(transformItem ? items.map(transformItem) : undefined);
      } catch (err: any) {
        setItems([]);
        setError(err?.toString());
      } finally {
        setIsLoading(false);
      }
    };

    loadDataAsync();
  }, [loadData, transformItem]);

  return {items: items ?? Array<TOut>(), isLoading, error};
};

export default useLoadingAndError;
