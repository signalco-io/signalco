'use client';

import { Link } from '@signalco/ui/dist/Link';
import { Stack } from '@signalco/ui/dist/Stack';

export default function FeaturesPage() {
    return (
        <Stack spacing={1}>
            <Link href="/features/dashboards">Dashboards</Link>
            <Link href="/features/processes">Processes</Link>
        </Stack>
    );
}
