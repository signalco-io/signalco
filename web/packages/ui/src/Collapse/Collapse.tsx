import { useEffect, useRef, useState } from 'react';
import { ChildrenProps } from '../sharedTypes';

export interface CollapseProps extends ChildrenProps {
    appear: boolean,
    duration?: number,
}

export default function Collapse({ children, appear, duration = 200 }: CollapseProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [targetHeight, setHeight] = useState<number | undefined>(0);

    useEffect(() => {
        if (containerRef.current) {
            setHeight(appear
                ? containerRef.current.scrollHeight
                : 0);
        }
    }, [appear]);

    return (
        <div
            ref={containerRef}
            style={{
                height: `${targetHeight}px`,
                transition: `height ${duration}ms ease-out`,
                overflow: 'hidden'
            }}>
            {children}
        </div>
    )
}
