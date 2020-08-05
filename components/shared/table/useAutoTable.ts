import { useState, useEffect } from "react";

const useAutoTable = (
  loadData: () => Promise<Array<any>>,
  transformItem: null | ((item: any) => any) = null
): [Array<any> | null, boolean, string | null] => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<Array<any> | null>(null);

  const loadDataAsync = async () => {
    try {
      const items = await loadData();
      setItems(transformItem ? items.map(transformItem) : items);
    } catch (err) {
      setItems([]);
      setError(err);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    loadDataAsync();
  }, []);

  return [items, isLoading, error];
};

export default useAutoTable;
