import { useMemo, useState } from 'react';
import { objectWithKey } from '@signalco/js';

export function filterFuncObjectStringProps<TItem extends object>(i: TItem, kw: string) {
    const kwLower = kw.toLowerCase();
    return Object
        .keys(i)
        .filter(ik => {
            const val = objectWithKey(i, ik);
            return val ? ((val[ik]?.toString().toLowerCase().indexOf(kwLower) ?? -1) >= 0) : false;
        })
        .length > 0;
}

function defaultSearchFunc<TItem>(i: TItem, kw: string) {
    return typeof i === 'string' && i.toString().toLocaleLowerCase() === kw;
}

export type UseSearchReturn<TItem> = [TItem[], string, (text: string) => void];

export function useSearch<TItem>(items?: TItem[], filterFunc?: (item: TItem, keyword: string) => boolean): UseSearchReturn<TItem> {
    const [searchText, setSearchText] = useState<string>('');
    const filteredItems = useMemo(() => searchText
        ? (items || []).filter(i => filterFunc
            ? filterFunc(i, searchText.toLowerCase())
            : defaultSearchFunc(i, searchText.toLocaleLowerCase()))
        : items || [],
        [filterFunc, items, searchText]);

    return [filteredItems, searchText, setSearchText];
}
