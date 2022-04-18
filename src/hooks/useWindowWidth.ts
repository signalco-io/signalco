import { useState } from 'react';
import useIsomorphicLayoutEffect from './useIsomorphicLayoutEffect';

const useWindowWidth = () => {
    const [width, setWidth] = useState<number | undefined>(undefined);

    useIsomorphicLayoutEffect(() => {
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
