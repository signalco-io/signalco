'use client';

import { ComponentProps, MouseEventHandler, TouchEventHandler, forwardRef } from 'react';
import { cx } from 'classix';
import { Divider } from '@signalco/ui/dist/Divider';

export type ResizeHandleProps = {
    onMouseDown: MouseEventHandler;
    onTouchStart: TouchEventHandler;
    orientation?: ComponentProps<typeof Divider>['orientation'];
};

export const ResizeHandle = forwardRef<HTMLDivElement, ResizeHandleProps>(({ orientation = 'horizontal', onMouseDown, onTouchStart }, ref) => {
    return (
        <div
            ref={ref}
            onMouseDown={onMouseDown}
            onTouchStart={onTouchStart}
            className={cx(
                'flex items-center hover:bg-muted/30',
                orientation === 'horizontal' && 'w-full h-[9px] hover:cursor-ns-resize',
                orientation === 'vertical' && 'h-full w-[9px] flex-col hover:cursor-ew-resize'
            )}>
            <Divider orientation={orientation} />
        </div>
    );
});
ResizeHandle.displayName = 'ResizeHandle';
