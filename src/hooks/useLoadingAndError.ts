import { useEffect, useState } from "react";

const useLoadingAndError = <TIn, TOut>(
  loadData?: () => Promise<TIn[]>,
  transformItem?: (item: TIn) => TOut
): [Array<TOut>, boolean, string | undefined] => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);
  const [items, setItems] = useState<Array<TOut> | undefined>(undefined);

  useEffect(() => {
    const loadDataAsync = async () => {
      try {
        if (!loadData) 
          return;
        const items = await loadData();
        setItems(transformItem ? items.map(transformItem) : undefined);
      } catch (err: any) {
        setItems([]);
        setError(err?.toString());
      } finally {
        setIsLoading(false);
      }
    };

    loadDataAsync();
  }, []);

  return [items ?? [], isLoading, error];
};

export default useLoadingAndError;
