import { useMemo, useState } from 'react';

export const filterFuncObjectStringProps = <TItem extends object>(i: TItem, kw: string) =>
    Object
        .keys(i)
        .filter(ik =>
            typeof (i as any)[ik] === 'string' && (i as any)[ik].toString().toLowerCase().indexOf(kw) >= 0)
        .length > 0;

const defaultSearchFunc = <TItem>(i: TItem, kw: string) => typeof i === 'string' && i.toString().toLocaleLowerCase() === kw;

type UseSearchReturn<TItem> = [TItem[], string, (text: string) => void];

const useSearch = <TItem>(items?: TItem[], filterFunc?: (item: TItem, keyword: string) => boolean): UseSearchReturn<TItem> => {
    const [searchText, setSearchText] = useState<string>('');

    const handleSearchTextChange = (text: string) => {
        setSearchText(text);
    };

    const filteredItems = useMemo(() => searchText
        ? (items || []).filter(i => filterFunc ? filterFunc(i, searchText.toLowerCase()) : defaultSearchFunc(i, searchText.toLocaleLowerCase()))
        : items || [], [filterFunc, items, searchText]);

    return [filteredItems, searchText, handleSearchTextChange];
};

export default useSearch;
