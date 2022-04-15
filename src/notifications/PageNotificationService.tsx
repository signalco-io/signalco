import { Button } from '@mui/material';
import { SnackbarMessage, OptionsObject, SnackbarKey, VariantType } from 'notistack';

class PageNotificationService {
    private _enqueue?: (message: SnackbarMessage, options?: OptionsObject | undefined) => SnackbarKey;
    private _close?: (key?: SnackbarKey | undefined) => void;

    setSnackbar(
        enqueue: (message: SnackbarMessage, options?: OptionsObject | undefined) => SnackbarKey,
        close: (key?: SnackbarKey | undefined) => void) {
        this._enqueue = enqueue;
        this._close = close;
    }

    show(text: string, variant: VariantType = "default") {
        if (variant === "warning" || variant === "error") {
            (variant === 'error' ? console.error : console.warn)(`User presented with ${variant}: ${text}`);
        }

        if (this._enqueue) {
            return this._enqueue(text, {
                variant: variant,
                autoHideDuration: 5000
            });
        }
    }

    prompt(text: string, variant: VariantType = "default", actionLabel: string, actionCallback: () => void) {
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
