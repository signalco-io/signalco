import { Drawer as MobilePrimitive } from 'vaul';
import React, { HTMLAttributes } from 'react';
import { Close } from '@signalco/ui-icons'
import { useWindowRect } from '@signalco/hooks/useWindowRect';
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { VisuallyHidden } from '../VisuallyHidden';
import { cx } from '../cx'

export type ModalProps = Omit<HTMLAttributes<HTMLDivElement>, 'title'> & {
    trigger?: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    modal?: boolean;
    title: string;
    hideClose?: boolean;
    disableMobile?: boolean;
    mobileOverride?: boolean;
    dismissible?: boolean;
};

function DesktopModal({
    children,
    className,
    trigger,
    open,
    modal,
    hideClose,
    onOpenChange,
    title,
    dismissible = true,
    ...rest
}: ModalProps) {
    return (
        <DialogPrimitive.Root open={open} onOpenChange={onOpenChange} modal={modal}>
            {trigger && (
                <DialogPrimitive.Trigger asChild>
                    {trigger}
                </DialogPrimitive.Trigger>
            )}
            <DialogPrimitive.Portal>
                <DialogPrimitive.Overlay
                    className="bg-background/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 backdrop-blur-sm"
                />
                <DialogPrimitive.Content
                    className={cx(
                        'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg md:w-full',
                        className
                    )}
                    {...rest}
                >
                    <VisuallyHidden>
                        <DialogPrimitive.DialogTitle>
                            {title}
                        </DialogPrimitive.DialogTitle>
                    </VisuallyHidden>
                    {children}
                    {(!dismissible || !hideClose) && (
                        <DialogPrimitive.Close className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none">
                            <Close className="size-4" />
                            <span className="sr-only">Close</span>
                        </DialogPrimitive.Close>
                    )}
                </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
    )
}

function MobileModal({
    children,
    className,
    trigger,
    open,
    modal,
    onOpenChange,
    title,
    dismissible = true,
    ...rest
}: ModalProps) {
    return (
        <MobilePrimitive.Root dismissible={dismissible} open={open} onOpenChange={onOpenChange} modal={modal} shouldScaleBackground>
            {trigger && (
                <MobilePrimitive.Trigger asChild>
                    {trigger}
                </MobilePrimitive.Trigger>
            )}
            <MobilePrimitive.Portal>
                <MobilePrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 " />
                <MobilePrimitive.Content
                    className={cx(
                        'fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] border bg-background',
                        className)}
                    {...rest}>
                    <VisuallyHidden>
                        <MobilePrimitive.Title>
                            {title}
                        </MobilePrimitive.Title>
                    </VisuallyHidden>
                    <div className="bg-muted mx-auto mt-4 h-2 w-[100px] rounded-full" />
                    <div className="p-4">
                        {children}
                    </div>
                </MobilePrimitive.Content>
            </MobilePrimitive.Portal>
        </MobilePrimitive.Root>
    );
}

export function Modal({ disableMobile, mobileOverride, ...rest }: ModalProps) {
    const { width } = useWindowRect() ?? { width: 9999 };
    const isMobile = width < 768;
    console.log('isMobile', isMobile, 'disableMobile', disableMobile, 'mobileOverride', mobileOverride, width);
    if (mobileOverride || (isMobile && !disableMobile)) {
        return <MobileModal {...rest} />;
    }
    return <DesktopModal {...rest} />;
}
