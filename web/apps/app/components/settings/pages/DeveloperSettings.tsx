'use client';

import React, { useEffect, useState } from 'react';
import { Typography } from '@signalco/ui-primitives/Typography';
import { Stack } from '@signalco/ui-primitives/Stack';
import { Button } from '@signalco/ui-primitives/Button';
import { showNotification } from '@signalco/ui-notifications';
import { FormBuilder } from '@enterwell/react-form-builder';
import { useDeveloperForm } from '../hooks/useDeveloperForm';

export function DeveloperSettings() {
    const form = useDeveloperForm();

    const [workerRegistration, setWorkerRegistration] = useState<ServiceWorkerRegistration | undefined>();
    useEffect(() => {
        (async () => {
            try {
                setWorkerRegistration(await navigator.serviceWorker.ready);
            } catch (error) {
                console.debug('Service worker not available', error);
            }
        })();
    }, []);

    const handleUnregisterWorker = async () => {
        if (!workerRegistration) {
            console.warn('No worker to unregister');
            return;
        }

        try {
            await workerRegistration.unregister();
            setWorkerRegistration(undefined);
            showNotification('Service worker unregistered successfully.', 'success');
        } catch (error) {
            console.error('Failed to unregister service worker', error);
            showNotification('Failed to unregister service worker.', 'error');
        }
    }

    return (
        <Stack spacing={2}>
            <FormBuilder form={form} />
            <Stack spacing={1}>
                <Typography level="h5">Service Worker</Typography>
                <Typography level="body2">Service worker is {workerRegistration ? 'registered' : 'not registered'}</Typography>
                {Boolean(workerRegistration) && (
                    <>
                        <Typography level="body2">Active state: {workerRegistration?.active?.state ?? '-'}</Typography>
                        <Typography level="body2">Installing state: {workerRegistration?.installing?.state ?? '-'}</Typography>
                        <Typography level="body2">Waiting state: {workerRegistration?.waiting?.state ?? '-'}</Typography>
                        <Typography level="body2">Scope: {workerRegistration?.scope}</Typography>
                        <Button onClick={handleUnregisterWorker}>Unregister</Button>
                    </>
                )}
            </Stack>
        </Stack>
    );
}
