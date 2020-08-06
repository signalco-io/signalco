import { useState, useEffect } from "react";

const useLoadingAndError = <TIn, TOut>(
  loadData: () => Promise<TIn[]>,
  transformItem: null | ((item: TIn) => TOut) = null
): [Array<TIn | TOut> | null, boolean, string | null] => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<Array<TIn | TOut> | null>(null);

  const loadDataAsync = async () => {
    try {
      const items = await loadData();
      setItems(transformItem ? items.map(transformItem) : items);
    } catch (err) {
      setItems([]);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDataAsync();
  }, []);

  return [items, isLoading, error];
};

export default useLoadingAndError;
