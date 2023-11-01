import { HTMLAttributes } from 'react';
import { cx } from 'classix'
import { Close } from '@signalco/ui-icons'
import * as DialogPrimitive from '@radix-ui/react-dialog'

export type ModalProps = HTMLAttributes<HTMLDivElement> & {
    trigger?: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
};

export function Modal({
    children,
    className,
    trigger,
    open,
    onOpenChange,
    ...rest
}: ModalProps) {
    return (
        <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
            {trigger && (
                <DialogPrimitive.Trigger asChild>
                    {trigger}
                </DialogPrimitive.Trigger>
            )}
            <DialogPrimitive.Portal>
                <DialogPrimitive.Overlay
                    className="uitw-fixed uitw-inset-0 uitw-z-50 uitw-bg-background/80 uitw-backdrop-blur-sm data-[state=open]:uitw-animate-in data-[state=closed]:uitw-animate-out data-[state=closed]:uitw-fade-out-0 data-[state=open]:uitw-fade-in-0"
                />
                <DialogPrimitive.Content
                    className={cx(
                        'uitw-fixed uitw-left-[50%] uitw-top-[50%] uitw-z-50 uitw-grid uitw-w-full uitw-max-w-lg uitw-translate-x-[-50%] uitw-translate-y-[-50%] uitw-gap-4 uitw-border uitw-bg-background uitw-p-6 uitw-shadow-lg uitw-duration-200 data-[state=open]:uitw-animate-in data-[state=closed]:uitw-animate-out data-[state=closed]:uitw-fade-out-0 data-[state=open]:uitw-fade-in-0 data-[state=closed]:uitw-zoom-out-95 data-[state=open]:uitw-zoom-in-95 data-[state=closed]:uitw-slide-out-to-left-1/2 data-[state=closed]:uitw-slide-out-to-top-[48%] data-[state=open]:uitw-slide-in-from-left-1/2 data-[state=open]:uitw-slide-in-from-top-[48%] sm:uitw-rounded-lg md:uitw-w-full',
                        className
                    )}
                    {...rest}
                >
                    {children}
                    <DialogPrimitive.Close className="uitw-absolute uitw-right-4 uitw-top-4 uitw-rounded-sm uitw-opacity-70 uitw-ring-offset-background uitw-transition-opacity hover:uitw-opacity-100 focus:uitw-outline-none focus:uitw-ring-2 focus:uitw-ring-ring focus:uitw-ring-offset-2 disabled:uitw-pointer-events-none data-[state=open]:uitw-bg-accent data-[state=open]:uitw-text-muted-foreground">
                        <Close className="uitw-h-4 uitw-w-4" />
                        <span className="uitw-sr-only">Close</span>
                    </DialogPrimitive.Close>
                </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
    )
}
