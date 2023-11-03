'use client';

import { ReactNode } from 'react';
import { useResizeable } from './useResizeable';
import { ResizeHandle } from './ResizeHandle';

export function SplitView({ children }: { children: ReactNode[] }) {
    const { fixedSideRef, handleRef, handlers } = useResizeable({
        orientation: 'vertical'
    });

    return (
        <div className="h-full">
            <div className="grid grid-cols-[minmax(0,1fr)] grid-rows-[1fr_3fr] md:h-full md:grid-cols-[1fr_9px_5fr] md:grid-rows-[minmax(0,1fr)]">
                <div ref={fixedSideRef} className="md:h-full md:w-[320px]">
                    {children && children[0]}
                </div>
                <ResizeHandle
                    ref={handleRef}
                    className="hidden md:flex"
                    onMouseDown={handlers.handleMouseDown}
                    onTouchStart={handlers.handleTouchStart}
                    orientation="vertical"
                />
                <div className="md:w-full">
                    {children && children[1]}
                </div>
            </div>
        </div>
    );
}
