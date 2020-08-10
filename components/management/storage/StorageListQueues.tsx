import StorageRepository from "../../../src/management/storage/StorageRepository";
import useAutoTable from "../../shared/table/useAutoTable";
import AutoList, { IAutoListItem } from "../../shared/list/AutoList";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";

const StorageListQueues = () => {
  const transformItem = (item: string) => {
    return {
      id: item,
      value: item.substring(item.lastIndexOf("/")),
      icon: OpenInNewIcon,
    };
  };
  const [items, isLoading, error] = useAutoTable(
    StorageRepository.getQueuesAsync,
    transformItem
  );
  return (
    <AutoList
      items={items as IAutoListItem[]}
      isLoading={isLoading}
      error={error}
    />
  );
};

export default StorageListQueues;
