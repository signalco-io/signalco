import StorageRepository from "../../../src/management/storage/StorageRepository";
import AutoTable, { IAutoTableItem } from "../../shared/table/AutoTable";
import useAutoTable from "../../shared/table/useAutoTable";

const StorageListTables = () => {
  const transformItem = (item: string) => {
    return {
      id: item,
      name: item.substring(item.lastIndexOf("/")),
      url: item,
    };
  };
  const [items, isLoading, error] = useAutoTable(
    StorageRepository.getTablesAsync,
    transformItem
  );
  return (
    <AutoTable
      items={items as IAutoTableItem[]}
      isLoading={isLoading}
      error={error}
    />
  );
};

export default StorageListTables;
