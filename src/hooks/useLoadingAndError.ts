import { useEffect, useState } from "react";

const useLoadingAndError = <TIn, TOut>(
  loadData: () => Promise<TIn[]>,
  transformItem?: (item: TIn) => TOut
): [Array<TOut>, boolean, string | undefined] => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);
  const [items, setItems] = useState<Array<TOut> | undefined>(undefined);

  const loadDataAsync = async () => {
    try {
      const items = await loadData();
      setItems(transformItem ? items.map(transformItem) : undefined);
    } catch (err: any) {
      setItems([]);
      setError(err?.toString());
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDataAsync();
  }, []);

  return [items ?? [], isLoading, error];
};

export default useLoadingAndError;
