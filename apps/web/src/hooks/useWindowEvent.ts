import useIsomorphicLayoutEffect from './useIsomorphicLayoutEffect';

export default function useWindowEvent<K extends keyof WindowEventMap>(type: K, listener: (this: Window, ev: WindowEventMap[K]) => void  ) {
    useIsomorphicLayoutEffect(() => {
        window.addEventListener(type, listener);
        return () => window.removeEventListener(type, listener);
    }, []);
}
