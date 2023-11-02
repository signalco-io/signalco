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
            <div className="grid h-full grid-cols-[1fr_9px_5fr]">
                <div ref={fixedSideRef} className="h-full w-[320px]">
                    {children && children[0]}
                </div>
                <ResizeHandle
                    ref={handleRef}
                    onMouseDown={handlers.handleMouseDown}
                    onTouchStart={handlers.handleTouchStart}
                    orientation="vertical"
                />
                <div className="w-full">
                    {children && children[1]}
                </div>
            </div>
        </div>
    );
}
