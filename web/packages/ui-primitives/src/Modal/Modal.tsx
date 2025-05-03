import { Drawer } from 'vaul';
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
                    className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
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
                    {!hideClose && (
                        <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
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
    ...rest
}: ModalProps) {
    return (
        <Drawer.Root open={open} onOpenChange={onOpenChange} modal={modal} shouldScaleBackground>
            {trigger && (
                <Drawer.Trigger asChild>
                    {trigger}
                </Drawer.Trigger>
            )}
            <Drawer.Portal>
                <Drawer.Overlay className="fixed inset-0 z-50 bg-black/50 " />
                <Drawer.Content
                    className={cx(
                        'fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] border bg-background',
                        className)}
                    {...rest}>
                    <VisuallyHidden>
                        <Drawer.Title>
                            {title}
                        </Drawer.Title>
                    </VisuallyHidden>
                    <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted" />
                    <div className="p-4">
                        {children}
                    </div>
                </Drawer.Content>
            </Drawer.Portal>
        </Drawer.Root>
    );
}

export function Modal(props: ModalProps) {
    const {
        disableMobile,
        mobileOverride
    } = props;
    const { width } = useWindowRect() ?? { width: 9999 };
    const isMobile = width < 768;
    if (mobileOverride || (isMobile && !disableMobile)) {
        return <MobileModal {...props} />;
    }
    return <DesktopModal {...props} />;
}
