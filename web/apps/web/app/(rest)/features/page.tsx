'use client';

import { Link, Stack } from '@signalco/ui';

export default function FeaturesPage() {
    return (
        <Stack spacing={1}>
            <Link href="/features/dashboards">Dashboards</Link>
            <Link href="/features/processes">Processes</Link>
        </Stack>
    );
}
