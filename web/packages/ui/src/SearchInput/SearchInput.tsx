import React, { useEffect } from 'react';
import { Input } from '@signalco/ui-primitives/Input';
import { useSearch, filterFuncObjectStringProps } from '@signalco/hooks/useSearch';

export type SearchInputProps<T> = {
    items: T[] | undefined,
    onFilteredItems: (filteredItems: T[]) => void
};

export function SearchInput<TItem extends object>({ items, onFilteredItems }: SearchInputProps<TItem>) {
    const [filteredItems, searchText, handleSearchTextChange] = useSearch(items, filterFuncObjectStringProps);

    useEffect(() => {
        onFilteredItems(filteredItems);
    }, [filteredItems, onFilteredItems]);

    return (
        <Input
            placeholder="Search..."
            value={searchText}
            onChange={(e) => handleSearchTextChange(e.target.value)}
            className="w-full sm:w-auto" />
    );
}
