'use client';

import { PropsWithChildren, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { Stack } from '@signalco/ui/dist/Stack';
import { Breadcrumbs } from '@signalco/ui/dist/Breadcrumbs';
import { KnownPages } from '../../../../../src/knownPages';
import { useProcess } from '../../../../../src/hooks/useProcess';
import { TypographyProcessName } from '../../../../../components/processes/TypographyProcessName';
import { ProcessDetails } from '../../../../../components/processes/ProcessDetails';
import { SplitView } from '../../../../../components/layouts/SplitView';

export default function ProcessLayout({ children, params }: PropsWithChildren<{ params: { id: string } }>) {
    const { id } = params;

    // Extract process run segment
    // Note: workaround for [params for layouts should include ALL dynamic route parameters, regardless of depth in the tree #49507](https://github.com/vercel/next.js/discussions/49507)
    // Example path: /processes/<ID>/runs/<RUN_ID>/...
    const pathname = usePathname();
    const runId = useMemo(() => {
        const match = pathname.match(/\/runs\/([^/]+)/);
        return match?.[1];
    }, [pathname]);

    const { data: process } = useProcess(id);

    const editable = Boolean(runId) ? false : process != null;

    const breadcrumbs = useMemo(() => [
        { label: 'Processes', href: KnownPages.Processes },
        Boolean(runId) && { label: <TypographyProcessName secondary id={id} />, href: KnownPages.Process(id) },
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
                    editable={editable} />
            </Stack>
            {children}
        </SplitView>
    );
}
