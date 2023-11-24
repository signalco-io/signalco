import { useEffect } from 'react';
import { Input } from '@signalco/ui-primitives/Input';
import useSearch, { filterFuncObjectStringProps } from '../../../src/hooks/useSearch';
import useLocale from '../../../src/hooks/useLocale';

export type SearchInputProps<T> = {
    items: T[] | undefined,
    onFilteredItems: (filteredItems: T[]) => void
};

export default function SearchInput<TItem extends object>({ items, onFilteredItems }: SearchInputProps<TItem>) {
    const { t } = useLocale('App', 'Components', 'SearchInput');
    const [filteredItems, searchText, handleSearchTextChange] = useSearch(items, filterFuncObjectStringProps);

    useEffect(() => {
        onFilteredItems(filteredItems);
    }, [filteredItems, onFilteredItems]);

    return (
        <Input
            placeholder={t('Label')}
            value={searchText}
            onChange={(e) => handleSearchTextChange(e.target.value)}
            className="w-full sm:w-auto" />
    );
}
