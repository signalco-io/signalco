'use client';

import dynamic from 'next/dynamic';
import { Stack } from '@signalco/ui-primitives/Stack';
import PageCenterHeader from '../../../../components/pages/PageCenterHeader';

const LayoutResourceGraph = dynamic(() => import('./LayoutResourceGraph'), { ssr: false, loading: () => <div>Loading...</div> });

export default function InfrastructurePage() {
    return (
        <Stack spacing={8}>
            <PageCenterHeader level="h1">
                Infrastructure
            </PageCenterHeader>
            <LayoutResourceGraph />
        </Stack>
    );
}
