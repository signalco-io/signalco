import { useEffect } from 'react';
import { PageNotificationVariant, showNotification } from '@signalco/ui-notifications';

export function useErrorNotification(error: Error | null, message: string, variant?: PageNotificationVariant) {
    useEffect(() => {
        if (error) {
            console.error(error);
            showNotification(message, variant ?? 'error');
        }
    }, [error, message, variant]);
}
