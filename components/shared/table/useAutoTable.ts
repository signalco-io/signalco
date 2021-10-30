import useLoadingAndError from "../../../src/hooks/useLoadingAndError";

const useAutoTable = <TIn, TOut>(
  loadData?: (() => Promise<TIn[]>) | Promise<TIn[]>,
  transformItem?: ((item: TIn) => TOut)
) => {
  return useLoadingAndError(loadData, transformItem);
};

export default useAutoTable;
