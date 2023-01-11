import { useLayoutEffect, useState } from 'react';

export interface ClientRect {
    width: number;
    height: number;
    top: number;
    left: number;
    right: number;
    bottom: number;
    scrollY: number;
  }

export function getWindowClientRect(element: typeof window): ClientRect {
    const width = element.innerWidth;
    const height = element.innerHeight;

    return {
        top: 0,
        left: 0,
        right: width,
        bottom: height,
        width,
        height,
        scrollY: element.scrollY
    };
}

export default function useWindowRect(element: typeof window | null = typeof window !== 'undefined' ? window : null) {
    const [rect, setRect] = useState<ClientRect | undefined>(element ? getWindowClientRect(element) : undefined);

    useLayoutEffect(() => {
        if (!element) return;

        function updateNumberOfColumns() {
            if (element) {
                setRect(getWindowClientRect(element));
            }
        }

        window.addEventListener('resize', updateNumberOfColumns);
        window.addEventListener('scroll', updateNumberOfColumns);
        updateNumberOfColumns();
        return () => {
            window.removeEventListener('resize', updateNumberOfColumns);
            window.removeEventListener('scroll', updateNumberOfColumns);
        }
    }, [element]);

    return rect;
}