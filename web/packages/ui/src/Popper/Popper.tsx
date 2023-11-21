import { type HTMLAttributes } from 'react';
import { cx } from '@signalco/ui/cx';
import * as PopoverPrimitive from '@radix-ui/react-popover'

export type PopperProps = HTMLAttributes<HTMLDivElement> & {
    trigger?: React.ReactNode;
    anchor?: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
};

export function Popper({ className, trigger, anchor, open, onOpenChange, ...rest }: PopperProps) {
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
            <PopoverPrimitive.Portal>
                <PopoverPrimitive.Content
                    align="center"
                    sideOffset={4}
                    className={cx(
                        'z-50 w-72 rounded-md border bg-popover text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
                        className
                    )}
                    {...rest}
                />
            </PopoverPrimitive.Portal>
        </PopoverPrimitive.Root>
    );
}
