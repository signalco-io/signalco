import { toast } from 'react-toastify';
import { ReactNode } from 'react';
import { Stack } from '@mui/system';
import { Button } from '@mui/joy';

export type PageNotificationVariant = 'default' | 'info' | 'success' | 'warning' | 'error';

export interface PageNotificationOptions {
    variant?: PageNotificationVariant;
    autoHideDuration?: number;
    persist?: boolean;
    action?: ReactNode
}

class PageNotificationService {
    private _enqueue(message: string | ReactNode, options?: PageNotificationOptions): string | number {
        const content = options?.action
        ? (
            <Stack direction="row" alignItems="center" justifyContent="space-between">
                {message}
                {options.action}
            </Stack>
        ) : message;

        return toast(content, {
            autoClose: options?.persist ? false : options?.autoHideDuration,
            type: options?.variant,
            position: 'bottom-right',
            theme: 'dark'
        });
    }

    private _close(key?: string | number | undefined) {
        toast.dismiss(key);
    }

    show(text: string, variant: PageNotificationVariant = 'default') {
        if (variant === 'warning' || variant === 'error') {
            (variant === 'error' ? console.error : console.warn)(`User presented with ${variant}: ${text}`);
        }

        if (this._enqueue) {
            return this._enqueue(text, {
                variant: variant,
                autoHideDuration: 5000
            });
        }
    }

    prompt(text: string, variant: PageNotificationVariant = 'default', actionLabel: string, actionCallback: () => void) {
        if (this._enqueue) {
            return this._enqueue(text, {
                variant: variant,
                persist: true,
                action: <Button onClick={actionCallback}>{actionLabel}</Button>
            });
        }
    }

    hide(key?: string | number) {
        if (key && this._close) {
            this._close(key);
        }
    }
}

const service = new PageNotificationService();

export default service;
