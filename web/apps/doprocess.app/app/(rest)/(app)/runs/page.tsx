'use client';

import { useSearchParam } from '@signalco/hooks/dist/useSearchParam';
import { RunsListView } from '../../../../components/processes/RunsListView';

export default function RunsPage() {
    const [processId] = useSearchParam('process-id');

    return (
        <RunsListView processId={processId} />
    )
}
