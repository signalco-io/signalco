import useLoadingAndError from '../../../src/hooks/useLoadingAndError';
import { LocalizeFunc } from '../../../src/hooks/useLocale';

export default function useAutoTable<TIn, TOut>(loadData?: (() => Promise<TIn[]>) | Promise<TIn[]>,
  transformItem?: ((item: TIn) => TOut),
  localize?: LocalizeFunc) {
  return {
    ...useLoadingAndError(loadData, transformItem),
    localize
  };
}
