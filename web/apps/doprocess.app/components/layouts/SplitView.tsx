'use client';

import { ReactNode } from 'react';
import { useResizeable } from '../../src/hooks/useResizeable';
import { ResizeHandle } from './ResizeHandle';

type SplitViewProps = {
    children: ReactNode[];
    minSize?: number;
    maxSize?: number;
    collapsable?: boolean;
    collapsed?: boolean;
    collapsedSize?: number;
    onCollapsedChanged?: (collapsed: boolean) => void;
};

export function SplitView({ children, minSize, maxSize, collapsable, collapsed, onCollapsedChanged, collapsedSize }: SplitViewProps) {
    const { fixedSideRef, handleRef, handlers } = useResizeable({
        orientation: 'vertical',
        minSize,
        maxSize,
        collapsable,
        collapsed: collapsed ?? false,
        collapsedSize: collapsedSize ?? 0,
        onCollapsedChanged: onCollapsedChanged ?? (() => { }),
    });

    return (
        <div className="h-full">
            <div className="grid grid-cols-[minmax(0,1fr)] grid-rows-[1fr_3fr] md:h-full md:grid-cols-[auto_9px_5fr] md:grid-rows-[minmax(0,1fr)]">
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
