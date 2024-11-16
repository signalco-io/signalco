'use client';

import React from 'react';
import { Typography } from '@signalco/ui-primitives/Typography';
import { Row } from '@signalco/ui-primitives/Row';
import { Link } from '@signalco/ui-primitives/Link';
import { cx } from '@signalco/ui-primitives/cx';
import { JsonResponse } from '@signalco/js';
import { usePromise } from '@enterwell/react-hooks';

export async function fetchChecklySystemStatus(pageId: number) {
    const response = await fetch(`https://api.checklyhq.com/v1/status-page/${pageId}/statuses?page=1&limit=99`);
    const responseJson = await response.json();
    return (responseJson as JsonResponse<{ summary: { totalFailing: number, totalDegraded: number } }>)?.summary;
}

function fetchChecklySignalcoSystemStatus() {
    return fetchChecklySystemStatus(103507);
}

export function SystemStatusLabel() {
    const { item } = usePromise(fetchChecklySignalcoSystemStatus);

    let status: 'operational' | 'major' | 'partial' | 'degraded' = 'operational';
    let statusText = 'All systems operational';
    if (item) {
        if (item?.totalFailing ?? 0 >= 3) {
            status = 'major';
            statusText = 'Major outage';
        } else if (item?.totalFailing ?? 0 > 0) {
            status = 'partial';
            statusText = 'Some systems are experiencing issues';
        } else if (item?.totalDegraded ?? 0 > 0) {
            status = 'degraded';
            statusText = 'Some systems are experiencing issues';
        }
    }

    return (
        <Link href="https://status.signalco.io">
            <Row alignItems="center" spacing={1}>
                <div className={cx(
                    'h-2 w-2 rounded-full bg-green-500',
                    status === 'operational' && 'bg-green-500',
                    status === 'degraded' && 'bg-yellow-500',
                    status === 'partial' && 'bg-yellow-500',
                    status === 'major' && 'bg-red-500'
                )} />
                <Typography level="body2">{statusText}</Typography>
            </Row>
        </Link>
    );
}
