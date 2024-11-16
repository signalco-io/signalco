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

    const noWorkers = workers.data?.length === 0;
    const header = noWorkers ? 'You have no workers yet' : 'Select a worker to start';
    const subHeader = noWorkers ? 'Get workers from Workers Marketplace.' : null;

    // Redirect to first worker if there is one
    const firstWorkerId = !workers.isLoading && !workers.isPending && workers.data ? workers.data[0]?.id : null;
    if (firstWorkerId)
        redirect(KnownPages.AppWorker(firstWorkerId));

    return (
        <div className="relative flex h-screen w-full items-center justify-center">
            <NoWorkerBackground />
            <Stack spacing={4} alignItems="center">
                <Stack>
                    <Typography tertiary center>{header}</Typography>
                    {subHeader && <Typography tertiary center>{subHeader}</Typography>}
                </Stack>
                {noWorkers && (
                    <NavigatingButton
                        href={KnownPages.AppMarketplace}>
                        Visit Workers Marketplace
                    </NavigatingButton>
                )}
            </Stack>
        </div>
    );
}
