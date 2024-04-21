'use client';

import { useRouter } from 'next/navigation';
import { QueryList } from '@signalco/ui/QueryList';
import { KnownPages } from '../../../../../../src/knownPages';
import { useWorkerThreads } from '../../../../../../src/hooks/data/workers/useWorkerThreads';
import { useWorkerThreadCreate } from '../../../../../../src/hooks/data/workers/useWorkerThreadCreate';
import { WorkerThreadsListItem } from './WorkerThreadsListItem';
import { WorkersListEmptyPlaceholder } from './WorkersListEmptyPlaceholder';

export function WorkerThreadsList({ workerId, selectedThreadId }: { workerId: string; selectedThreadId?: string; }) {
    const threads = useWorkerThreads(workerId);
    const threadCreate = useWorkerThreadCreate(workerId);
    const router = useRouter();

    const handleNewThread = async () => {
        const createResponse = await threadCreate.mutateAsync();
        router.push(KnownPages.AppWorkerThread(workerId, createResponse.id));
    };

    return (
        <QueryList
            query={() => threads}
            itemRender={(item) => (<WorkerThreadsListItem workerId={workerId} thread={item} selected={selectedThreadId === item.id} />)}
            emptyPlaceholder={<WorkersListEmptyPlaceholder />}
            editable
            onEditing={handleNewThread}
            itemCreateLabel="New Thread"
            variant="outlined"
            createPosition="top" />
    );
}
