'use client';

import { QueryList } from '@signalco/ui/QueryList';
import { useWorkers } from '../../../../../src/hooks/data/workers/useWorkers';
import { WorkersListItem } from './WorkersListItem';
import { WorkersListEmptyPlaceholder } from './WorkersListEmptyPlaceholder';

export function WorkersList({ selectedWorkerId }: { selectedWorkerId?: string; }) {
    return (
        <QueryList
            query={useWorkers}
            className="gap-1 overflow-y-auto p-2"
            itemRender={(item) => (<WorkersListItem worker={item} selected={item.id === selectedWorkerId} />)}
            emptyPlaceholder={<WorkersListEmptyPlaceholder />} />
    );
}
