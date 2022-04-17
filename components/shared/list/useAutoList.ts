import useLoadingAndError from '../../../src/hooks/useLoadingAndError';
import { IAutoListItem } from './AutoList';

const useAutoList = <TIn>(
  loadData: () => Promise<Array<TIn>>,
  transformItem: (item: TIn) => IAutoListItem
) => {
  return useLoadingAndError<TIn, IAutoListItem>(loadData, transformItem);
};

export default useAutoList;
