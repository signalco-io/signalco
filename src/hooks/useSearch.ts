import { useState } from "react";

export const filterFuncObjectStringProps = (i: any, kw: string) => Object.keys(i).filter(ik => typeof i[ik] === 'string' && i[ik].toString().toLowerCase().indexOf(kw) >= 0).length > 0;

const useSearch = (items?: any[], filterFunc?: (item: any, keyword: string) => boolean, minItems?: number): [any[], boolean, string, (text: string) => void] => {
  const [searchText, setSearchText] = useState<string>('');

  const handleSearchTextChange = (text: string) => {
    setSearchText(text);
  };

  const defaultSearchFunc = (i: any, kw: string) => typeof i === 'string' && i.toString().toLocaleLowerCase() === kw;

  const showSearch = (items?.length ?? 0) > (minItems || 10);
  const filteredItems = showSearch && searchText
    ? (items || []).filter(i => filterFunc ? filterFunc(i, searchText.toLowerCase()) : defaultSearchFunc(i, searchText.toLocaleLowerCase()))
    : items || [];

  return [filteredItems, showSearch, searchText, handleSearchTextChange];
};

export default useSearch;