import { Suspense } from 'react';
import { RunsListView } from '../../../../components/processes/processes/RunsListView';

export default function RunsPage() {
    return (
        <Suspense>
            <RunsListView />
        </Suspense>
    )
}
