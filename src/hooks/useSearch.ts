import { startTransition, useDeferredValue, useEffect, useMemo, useState } from 'react';

export const filterFuncObjectStringProps = (i: any, kw: string) => Object.keys(i).filter(ik => typeof i[ik] === 'string' && i[ik].toString().toLowerCase().indexOf(kw) >= 0).length > 0;

const defaultSearchFunc = (i: any, kw: string) => typeof i === 'string' && i.toString().toLocaleLowerCase() === kw;

const useSearch = (items?: any[], filterFunc?: (item: any, keyword: string) => boolean, minItems?: number): [any[], boolean, string, (text: string) => void] => {
  const [searchText, setSearchText] = useState<string>('');
//   const deferredSearchText = useDeferredValue(searchText);
//   const deferredItems = useDeferredValue(items);

  const handleSearchTextChange = (text: string) => {
     setSearchText(text);
  };

  const showSearch = useMemo(() => (items?.length ?? 0) > (minItems || 10), [items, minItems]);
  const [filteredItems, setFilteredItems] = useState<any[]>([]);
    useEffect(() => {
        startTransition(() => {
            setFilteredItems(showSearch && searchText
                ? (items || []).filter(i => filterFunc ? filterFunc(i, searchText.toLowerCase()) : defaultSearchFunc(i, searchText.toLocaleLowerCase()))
                : items || []);
        });
  }, [items, searchText]);

    const deferredFileteredItems = useDeferredValue(filteredItems);
  return [deferredFileteredItems, showSearch, searchText, handleSearchTextChange];
};

export default useSearch;
