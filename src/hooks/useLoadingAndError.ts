import { useEffect, useState } from 'react';
import useLoadAndError from './useLoadAndError';

export type useLoadingAndErrorResult<TOut> = {
    items: Array<TOut>;
    isLoading: boolean;
    error: string | undefined;
};

export default function useLoadingAndError<TIn, TOut>(loadData?: (() => Promise<TIn[]>) | Promise<TIn[]>,
    transformItem?: (item: TIn) => TOut): useLoadingAndErrorResult<TOut> {
    const result = useLoadAndError<TIn[]>(loadData);
    const [state, setState] = useState<useLoadingAndErrorResult<TOut>>({ items: Array<TOut>(), isLoading: result.isLoading, error: result.error });

    useEffect(() => {
        const mappedResults = result.isLoading ||
            typeof result.error !== 'undefined' ||
            result.item == null
            ? []
            : (transformItem ? result.item.map(transformItem) : result.item.map(i => i as unknown as TOut));

        setState({
            items: mappedResults,
            isLoading: result.isLoading,
            error: result.error
        });
    }, [result.error, result.isLoading, result.item, transformItem]);

    return state;
}
