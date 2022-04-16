import { useLayoutEffect, useState } from 'react';

const useWindowWidth = () => {
    const [width, setWidth] = useState<number | undefined>(undefined);

    useLayoutEffect(() => {
        function updateNumberOfColumns() {
            setWidth(window.innerWidth);
        }
        window.addEventListener('resize', updateNumberOfColumns);
        updateNumberOfColumns();
        return () => window.removeEventListener('resize', updateNumberOfColumns);
    }, []);

    return width;
};

export default useWindowWidth;