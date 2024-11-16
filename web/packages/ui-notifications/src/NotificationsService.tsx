import { toast } from 'sonner';
import { ReactNode } from 'react';
import { Row } from '@signalco/ui-primitives/Row';
import { Button } from '@signalco/ui-primitives/Button';

export type PageNotificationVariant = 'default' | 'info' | 'success' | 'warning' | 'error';

export type PageNotificationOptions = {
    variant?: PageNotificationVariant;
    autoHideDuration?: number;
    persist?: boolean;
    action?: ReactNode;
}

function _enqueue(message: string | ReactNode, options?: PageNotificationOptions): string | number {
    const content = options?.action
        ? (
            <Row justifyContent="space-between">
                {message}
                {options.action}
            </Row>
        ) : message;

    let func = toast.info;
    if (options?.variant === 'success') {
        func = toast.success;
    } else if (options?.variant === 'warning') {
        func = toast.warning;
    } else if (options?.variant === 'error') {
        func = toast.error;
    }

    return func(content, {
        duration: options?.autoHideDuration,
    });
}

function _close(key?: string | number | undefined) {
    toast.dismiss(key);
}

export function showNotification(text: string, variant: PageNotificationVariant = 'default') {
    if (variant === 'warning' || variant === 'error') {
        (variant === 'error' ? console.error : console.warn)(`User presented with ${variant}: ${text}`);
    }

    return _enqueue(text, {
        variant: variant,
        autoHideDuration: 5000
    });
}

export function showPrompt(text: string, variant: PageNotificationVariant = 'default', actionLabel: string, actionCallback: () => void) {
    return _enqueue(text, {
        variant: variant,
        persist: true,
        action: <Button onClick={actionCallback}>{actionLabel}</Button>
    });
}

export function hideNotification(key?: string | number) {
    _close(key);
}
