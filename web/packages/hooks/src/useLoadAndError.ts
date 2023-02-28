import { useEffect, useRef, useState, useTransition } from 'react';

export type useLoadAndErrorResult<T> = {
    item?: T | undefined;
    isLoading: boolean;
    error?: string | undefined;
};

export default function useLoadAndError<T>(load?: (Promise<T> | undefined) | (() => Promise<T> | undefined)): useLoadAndErrorResult<T> {
    const [state, setState] = useState<useLoadAndErrorResult<T>>({ isLoading: true, item: undefined, error: undefined });
    const [, startTransition] = useTransition();
    const loadPromiseRef = useRef<Promise<T>>();

    useEffect(() => {
        const loadData = async () => {
            try {
                if (!load || loadPromiseRef.current) {
                    return;
                }

                loadPromiseRef.current = typeof load === 'function' ? load() : load;
                const item = await loadPromiseRef.current;

                startTransition(() => {
                    setState({ isLoading: false, item: item });
                    loadPromiseRef.current = undefined;
                });
            } catch (err: any) {
                setState({ isLoading: false, error: err?.toString() });
                loadPromiseRef.current = undefined;
            }
        };

        loadData();
    }, [load]);

    return state;
}
