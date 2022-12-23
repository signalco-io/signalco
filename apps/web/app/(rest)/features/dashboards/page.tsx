'use client';

import { Stack, Typography } from '@signalco/ui';
import PageCenterHeader from '../../../../components/pages/PageCenterHeader';

export default function FeatureDashboardsPage() {
    return (
        <Stack spacing={4}>
            <PageCenterHeader header="Dashboards" />
            <Typography level="h4">Widgets</Typography>
            <Stack spacing={2}>
                <Typography level="h5">Explore widgets</Typography>
            </Stack>
        </Stack>
    );
}
