import { ReactNode } from 'react';
import { cx } from '@signalco/ui-primitives/cx';
import { useResizeable } from '@signalco/hooks/useResizeable';
import { ResizeHandle } from './ResizeHandle';

export type SplitViewProps = {
    children: ReactNode[];
    size?: 'sm' | 'lg';
    minSize?: number;
    maxSize?: number;
    collapsable?: boolean;
    collapsed?: boolean;
    collapsedSize?: number;
    onCollapsedChanged?: (collapsed: boolean) => void;
};

export function SplitView({ children, size, minSize, maxSize, collapsable, collapsed, onCollapsedChanged, collapsedSize }: SplitViewProps) {
    const { fixedSideRef, handleRef, handlers } = useResizeable({
        orientation: 'vertical',
        minSize,
        maxSize,
        collapsable,
        collapsed: collapsed ?? false,
        collapsedSize: collapsedSize ?? 0,
        onCollapsedChanged: onCollapsedChanged ?? (() => { }),
        disableMobile: true
    });

    return (
        <div className="md:h-full">
            <div className="md:grid md:h-full md:grid-cols-[auto_1px_5fr] md:grid-rows-[minmax(0,1fr)]">
                <div ref={fixedSideRef} className={cx('w-full md:h-full', size === 'lg' ? 'md:w-[420px]' : 'md:w-[320px]')}>
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
