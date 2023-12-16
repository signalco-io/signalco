import { useRef, useEffect, useMemo } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useCallbackRef<T extends (...args: any[]) => any>(callback: T | undefined): T {
    const callbackRef = useRef(callback);

    useEffect(() => {
        callbackRef.current = callback;
    });

    return useMemo(() => ((...args) => callbackRef.current?.(...args)) as T, []);
}
