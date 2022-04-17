import { useLayoutEffect, useState } from 'react';

const useWindowWidth = () => {
    const [width, setWidth] = useState<number | undefined>(undefined);

    useLayoutEffect(() => {
        function updateNumberOfColumns() {
            if (width !== window.innerWidth)
                setWidth(window.innerWidth);
        }
        window.addEventListener('resize', updateNumberOfColumns);
        updateNumberOfColumns();
        return () => window.removeEventListener('resize', updateNumberOfColumns);
    }, [width]);

    return width;
};

export default useWindowWidth;
