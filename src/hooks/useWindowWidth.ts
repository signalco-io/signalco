import { useCallback, useState } from 'react';
import useWindowEvent from './useWindowEvent';

const browser = typeof window !== 'undefined';

export default function useWindowWidth() {
    const [width, setWidth] = useState<number | undefined>(browser ? window.innerWidth : undefined);

    const updateNumberOfColumns = useCallback(() => {
        setWidth(window.innerWidth || 0);
    }, []);

    useWindowEvent('resize', updateNumberOfColumns);

    return width;
}
