import { useMemo, useState } from 'react';
import { ObjectDictAny } from '@signalco/js';

export function filterFuncObjectStringProps<TItem extends ObjectDictAny>(i: TItem, kw: string) {
    return Object
        .keys(i)
        .filter(ik => ik in i && (i[ik]?.toString().toLowerCase().indexOf(kw) ?? -1) >= 0)
        .length > 0;
}

function defaultSearchFunc<TItem>(i: TItem, kw: string) {
    return typeof i === 'string' && i.toString().toLocaleLowerCase() === kw;
}

type UseSearchReturn<TItem> = [TItem[], string, (text: string) => void];

function useSearch<TItem>(items?: TItem[], filterFunc?: (item: TItem, keyword: string) => boolean): UseSearchReturn<TItem> {
    const [searchText, setSearchText] = useState<string>('');

    const handleSearchTextChange = (text: string) => {
        setSearchText(text);
    };

    const filteredItems = useMemo(() =>
        searchText
            ? (items || []).filter(i => filterFunc ? filterFunc(i, searchText.toLowerCase()) : defaultSearchFunc(i, searchText.toLocaleLowerCase()))
            : items || [],
    [filterFunc, items, searchText]);

    return [filteredItems, searchText, handleSearchTextChange];
}

export default useSearch;
