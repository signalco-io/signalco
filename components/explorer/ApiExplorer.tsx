import AutoList from "../shared/list/AutoList";
import useAutoList from "../shared/list/useAutoList";
import ApiExplorerRepository from "../../src/explorer/ExplorerRepository";

const ApiExplorer = () => {
  const transformItem = (item: string) => {
    return {
      id: item,
      value: item,
    };
  };
  const [items, isLoading, error] = useAutoList(
    ApiExplorerRepository.getGroups,
    transformItem
  );
  return <AutoList items={items} isLoading={isLoading} error={error} />;
};

export default ApiExplorer;
