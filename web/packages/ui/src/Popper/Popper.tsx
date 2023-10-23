import { type HTMLAttributes } from 'react';
import { cx } from 'classix';
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
                        'uitw-z-50 uitw-w-72 uitw-rounded-md uitw-border uitw-bg-popover uitw-text-popover-foreground uitw-shadow-md uitw-outline-none data-[state=open]:uitw-animate-in data-[state=closed]:uitw-animate-out data-[state=closed]:uitw-fade-out-0 data-[state=open]:uitw-fade-in-0 data-[state=closed]:uitw-zoom-out-95 data-[state=open]:uitw-zoom-in-95 data-[side=bottom]:uitw-slide-in-from-top-2 data-[side=left]:uitw-slide-in-from-right-2 data-[side=right]:uitw-slide-in-from-left-2 data-[side=top]:uitw-slide-in-from-bottom-2',
                        className
                    )}
                    {...rest}
                />
            </PopoverPrimitive.Portal>
        </PopoverPrimitive.Root>
    );
}
