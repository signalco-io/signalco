'use client';

import { useSearchParam } from '@signalco/hooks/useSearchParam';
import { List } from '../../shared/List';
import { useProcessRuns } from '../../../src/hooks/useProcessRuns';
import { useProcessesRuns } from '../../../src/hooks/useProcessesRuns';
import { RunsListItem } from './RunsListItem';
import { RunsListEmptyPlaceholder } from './RunsListEmptyPlaceholder';
import { ProcessRunCreateForm } from './ProcessRunCreateForm';

export function RunsList({ processId }: { processId?: string }) {
    const [showComplated] = useSearchParam('show-completed');
    const processRuns = useProcessRuns(processId, showComplated === 'true' ? 'completed' : 'running');
    const processesRuns = useProcessesRuns(!processId, showComplated === 'true' ? 'completed' : 'running');

    return (
        <List
            query={() => processId ? processRuns : processesRuns}
            itemRender={(item) => (<RunsListItem run={item} />)}
            editable={Boolean(processId) && showComplated !== 'true'}
            itemCreateLabel="New process run"
            createForm={processId ? <ProcessRunCreateForm processId={processId} redirect /> : undefined}
            emptyPlaceholder={<RunsListEmptyPlaceholder />}
        />
    );
}
