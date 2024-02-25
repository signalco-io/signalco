'use client';

import { redirect } from 'next/navigation';
import { Typography } from '@signalco/ui-primitives/Typography';
import { Stack } from '@signalco/ui-primitives/Stack';
import { NavigatingButton } from '@signalco/ui/NavigatingButton';
import { KnownPages } from '../../../../../src/knownPages';
import { useWorkers } from '../../../../../src/hooks/data/workers/useWorkers';
import { NoWorkerBackground } from './NoWorkerBackground';

export default function AppPage() {
    const workers = useWorkers();

    if (workers.data?.length === 0) {
        return (
            <div className="relative flex h-screen w-full items-center justify-center">
                <NoWorkerBackground />
                <Stack spacing={4} alignItems="center">
                    <Stack>
                        <Typography tertiary center>You have no workers yet.</Typography>
                        <Typography tertiary center>Get workers from Workers Markerplace.</Typography>
                    </Stack>
                    <NavigatingButton href={KnownPages.AppMarketplace}>Visit Workers Marketplace</NavigatingButton>
                </Stack>
            </div>
        );
    }

    const firstWorkerId = !workers.isLoading && !workers.isStale && workers.data ? workers.data[0]?.id : null;
    if (!firstWorkerId)
        return null;

    redirect(KnownPages.AppWorker(firstWorkerId));
}
