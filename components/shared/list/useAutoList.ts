import useLoadingAndError from "../../../src/hooks/useLoadingAndError";

const useAutoList = <TIn, TOut>(
  loadData: () => Promise<Array<TIn>>,
  transformItem: null | ((item: TIn) => TOut) = null
) => {
  return useLoadingAndError<TIn, TOut>(loadData, transformItem);
};

export default useAutoList;
