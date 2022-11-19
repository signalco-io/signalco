import { toast } from 'react-toastify';
import { ReactNode } from 'react';
import { Row } from '@signalco/ui';
import { Button } from '@mui/joy';

export type PageNotificationVariant = 'default' | 'info' | 'success' | 'warning' | 'error';

export interface PageNotificationOptions {
    variant?: PageNotificationVariant;
    autoHideDuration?: number;
    persist?: boolean;
    action?: ReactNode
}

function _enqueue(message: string | ReactNode, options?: PageNotificationOptions): string | number {
    const content = options?.action
        ? (
            <Row justifyContent="space-between">
                {message}
                {options.action}
            </Row>
        ) : message;

    return toast(content, {
        autoClose: options?.persist ? false : options?.autoHideDuration,
        type: options?.variant,
        position: 'bottom-right',
        theme: 'dark'
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
