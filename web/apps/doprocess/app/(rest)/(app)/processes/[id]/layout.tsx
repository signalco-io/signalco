'use client';

import { PropsWithChildren, useMemo } from 'react';
import { useParams, usePathname } from 'next/navigation';
import { Stack } from '@signalco/ui-primitives/Stack';
import { SplitView } from '@signalco/ui/SplitView';
import { Breadcrumbs } from '@signalco/ui/Breadcrumbs';
import { KnownPages } from '../../../../../src/knownPages';
import { TypographyProcessName } from '../../../../../components/processes/processes/TypographyProcessName';
import { ProcessDetails } from '../../../../../components/processes/processes/ProcessDetails';

export default function ProcessLayout({ children }: PropsWithChildren) {
    const params = useParams<{ id: string }>();
    const { id } = params;

    // Extract process run segment
    // Note: workaround for [params for layouts should include ALL dynamic route parameters, regardless of depth in the tree #49507](https://github.com/vercel/next.js/discussions/49507)
    // Example path: /processes/<ID>/runs/<RUN_ID>/...
    const pathname = usePathname();
    const runId = useMemo(() => {
        const match = pathname.match(/\/runs\/([^/]+)/);
        return match?.[1];
    }, [pathname]);

    const breadcrumbs = useMemo(() => [
        { label: 'Processes', href: KnownPages.Processes },
        Boolean(runId) && { label: <TypographyProcessName secondary id={id} noWrap />, href: KnownPages.Process(id) },
    ].filter(Boolean), [id, runId]);

    return (
        <SplitView minSize={230} size="lg">
            <Stack spacing={1} className="p-2">
                <Breadcrumbs
                    endSeparator
                    items={breadcrumbs} />
                <ProcessDetails
                    id={id}
                    runId={runId}
                    editable={true} />
            </Stack>
            {children}
        </SplitView>
    );
}
