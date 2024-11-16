import React, { type HTMLAttributes } from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover'
import { cx } from '../cx';

export type PopperProps = HTMLAttributes<HTMLDivElement> & {
    trigger?: React.ReactNode;
    anchor?: React.ReactNode;
    open?: boolean;
    side?: 'top' | 'right' | 'bottom' | 'left';
    sideOffset?: number;
    align?: 'start' | 'center' | 'end';
    alignOffset?: number;
    onOpenChange?: (open: boolean) => void;
    container?: HTMLElement;
};

export function Popper({ className, trigger, anchor, side, sideOffset, align, alignOffset, open, onOpenChange, container, ...rest }: PopperProps) {
    return (
        <PopoverPrimitive.Root open={open} onOpenChange={onOpenChange}>
            {trigger && (
                <PopoverPrimitive.Trigger asChild>
                    {trigger}
                </PopoverPrimitive.Trigger>
            )}
            {anchor && (
                <PopoverPrimitive.Anchor asChild>
                    {anchor}
                </PopoverPrimitive.Anchor>
            )}
            <PopoverPrimitive.Portal container={container}>
                <PopoverPrimitive.Content
                    align={align ?? 'center'}
                    sideOffset={sideOffset ?? 4}
                    side={side}
                    alignOffset={alignOffset ?? (align === 'center' ? 0 : align === 'start' ? -4 : 4)}
                    collisionPadding={Math.max(sideOffset ?? 0, alignOffset ?? 0)}
                    className={cx(
                        'z-50 w-72 rounded-lg border bg-popover text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
                        className
                    )}
                    {...rest}
                />
            </PopoverPrimitive.Portal>
        </PopoverPrimitive.Root>
    );
}
