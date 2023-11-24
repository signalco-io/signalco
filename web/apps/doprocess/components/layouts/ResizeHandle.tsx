'use client';

import { ComponentProps, HTMLAttributes, MouseEventHandler, TouchEventHandler, forwardRef } from 'react';
import { Divider } from '@signalco/ui-primitives/Divider';
import { cx } from '@signalco/ui-primitives/cx';

export type ResizeHandleProps = HTMLAttributes<HTMLDivElement> & {
    onMouseDown: MouseEventHandler;
    onTouchStart: TouchEventHandler;
    orientation?: ComponentProps<typeof Divider>['orientation'];
};

export const ResizeHandle = forwardRef<HTMLDivElement, ResizeHandleProps>(({
    orientation = 'horizontal', onMouseDown, onTouchStart, className, ...rest
}, ref) => {
    return (
        <div
            ref={ref}
            onMouseDown={onMouseDown}
            onTouchStart={onTouchStart}
            className={cx(
                'flex items-center hover:bg-muted/30',
                orientation === 'horizontal' && 'w-full h-[9px] hover:cursor-ns-resize',
                orientation === 'vertical' && 'h-full w-[9px] flex-col hover:cursor-ew-resize',
                className
            )}
            {...rest}>
            <Divider orientation={orientation} />
        </div>
    );
});
ResizeHandle.displayName = 'ResizeHandle';
