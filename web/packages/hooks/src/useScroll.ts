import React, { useLayoutEffect, useState } from 'react';

export function useScroll(elementRef: React.RefObject<HTMLElement | null>) {
    const [scroll, setScroll] = useState(0);

    useLayoutEffect(() => {
        if (!elementRef.current) return;

        function updateScroll() {
            if (elementRef.current) {
                setScroll(elementRef.current.scrollTop);
            }
        }

        const targetElRef = elementRef.current;
        if (!targetElRef) return;

        targetElRef.addEventListener('scroll', updateScroll);
        updateScroll();
        return () => {
            targetElRef.removeEventListener('scroll', updateScroll);
        };
    }, [elementRef]);

    return scroll;
}
