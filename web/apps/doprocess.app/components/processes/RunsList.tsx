'use client';

import { List } from '../shared/List';
import { useProcessRuns } from '../../src/hooks/useProcessRuns';
import { useProcessesRuns } from '../../src/hooks/useProcessesRuns';
import { RunsListItem } from './RunsListItem';

export function RunsList({ processId }: { processId?: string }) {
    const processRuns = useProcessRuns(processId);
    const processesRuns = useProcessesRuns(!processId);

    return (
        <List
            query={() => processId ? processRuns : processesRuns}
            itemRender={(item) => (<RunsListItem run={item} />)}
        />
    );
}
