import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';

export function useDocumentEvent<K extends keyof DocumentEventMap>(type: K, listener: (this: Document, ev: DocumentEventMap[K]) => void) {
    useIsomorphicLayoutEffect(() => {
        document.addEventListener(type, listener);
        return () => document.removeEventListener(type, listener);
    }, []);
}
