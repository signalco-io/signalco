import { DependencyList } from 'react';
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';

export function useWindowEvent<K extends keyof WindowEventMap>(type: K, listener: (this: Window, ev: WindowEventMap[K]) => void, dependencies?: DependencyList | undefined) {
    useIsomorphicLayoutEffect(() => {
        window.addEventListener(type, listener);
        return () => window.removeEventListener(type, listener);
    }, dependencies ?? []);
}
