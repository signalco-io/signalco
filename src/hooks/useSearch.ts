import { useDeferredValue, useEffect, useMemo, useState, useTransition } from 'react';

export const filterFuncObjectStringProps = <TItem extends object>(i: TItem, kw: string) => Object.keys(i).filter(ik => typeof (i as any)[ik] === 'string' && (i as any)[ik].toString().toLowerCase().indexOf(kw) >= 0).length > 0;

const defaultSearchFunc = <TItem>(i: TItem, kw: string) => typeof i === 'string' && i.toString().toLocaleLowerCase() === kw;

type UseSearchReturn<TItem> = [TItem[], boolean, string, (text: string) => void, boolean];

const useSearch = <TItem>(items?: TItem[], filterFunc?: (item: TItem, keyword: string) => boolean, minItems?: number): UseSearchReturn<TItem> => {
    const [searchText, setSearchText] = useState<string>('');
    const [isTransitioning, startTransition] = useTransition();

    const handleSearchTextChange = (text: string) => {
        setSearchText(text);
    };

    const showSearch = useMemo(() => (items?.length ?? 0) > (minItems || 10), [items, minItems]);
    const [filteredItems, setFilteredItems] = useState<TItem[]>([]);

    useEffect(() => {
        startTransition(() => {
            setFilteredItems(showSearch && searchText
                ? (items || []).filter(i => filterFunc ? filterFunc(i, searchText.toLowerCase()) : defaultSearchFunc(i, searchText.toLocaleLowerCase()))
                : items || []);
        });
    }, [filterFunc, items, searchText, showSearch]);

    const deferredFileteredItems = useDeferredValue(filteredItems);
    return [deferredFileteredItems, showSearch, searchText, handleSearchTextChange, isTransitioning];
};

export default useSearch;
