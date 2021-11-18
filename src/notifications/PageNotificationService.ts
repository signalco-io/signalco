import { SnackbarMessage, OptionsObject, SnackbarKey } from 'notistack';

class PageNotificationService {
    private _enqueue?: (message: SnackbarMessage, options?: OptionsObject | undefined) => SnackbarKey;
    private _close?: (key?: SnackbarKey | undefined) => void;

    setSnackbar(
        enqueue: (message: SnackbarMessage, options?: OptionsObject | undefined) => SnackbarKey,
        close: (key?: SnackbarKey | undefined) => void) {
        this._enqueue = enqueue;
        this._close = close;
    }

    show(text: string, variant: "info" | "warning" | "error" | "success" | "default" = "default") {
        if(variant === "warning" || variant === "error") {
            (variant === 'error' ? console.error : console.warn)(`User presented with ${variant}: ${text}`);
        }
        
        if (this._enqueue) {
            return this._enqueue(text, { 
                variant: variant, 
                preventDuplicate: true 
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