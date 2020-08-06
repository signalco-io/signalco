import useLoadingAndError from "../../../src/hooks/useLoadingAndError";

const useAutoTable = <TIn, TOut>(
  loadData: () => Promise<TIn[]>,
  transformItem: null | ((item: TIn) => TOut) = null
) => {
  return useLoadingAndError(loadData, transformItem);
};

export default useAutoTable;
