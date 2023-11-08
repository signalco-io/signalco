'use client';

import { List } from '../shared/List';
import { useProcessesRuns } from '../../src/hooks/useProcessesRuns';
import { RunsListItem } from './RunsListItem';

export function RunsList() {
    return (
        <List
            query={useProcessesRuns}
            itemRender={(item) => (<RunsListItem run={item} />)}
        />
    );
}
