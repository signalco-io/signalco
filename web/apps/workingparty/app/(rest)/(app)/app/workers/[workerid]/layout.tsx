'use client';

import { PropsWithChildren } from 'react';
import { Typography } from '@signalco/ui-primitives/Typography';
import { Stack } from '@signalco/ui-primitives/Stack';
import { QueryList, QueryListItem } from '@signalco/ui/QueryList';
import { PartyWorker } from '../../layout';
import { KnownPages } from '../../../../../../src/knownPages';

function useWorkerThreads() {
    return {
        data: [{
            worker: { id: 'asst_Mm1BbGNfwG3KidVHfEUivwBM', name: 'Junior Bookkeeper' },
            thread: { id: 'thread_6sggNeDol0yTvcgk8KUgWTXG', name: 'Bookkeeping' }
        }],
        isLoading: false,
    };
}

type PartyWorkerThread = {
    id: string;
    name: string;
};

type WorkerThreadListItemProps = {
    worker: PartyWorker;
    thread: PartyWorkerThread;
};

export function WorkerThreadsListItem({ worker, thread }: WorkerThreadListItemProps) {
    return (
        <QueryListItem
            label={(
                <Stack spacing={0.5}>
                    <Typography>{thread.name}</Typography>
                </Stack>
            )}
            className="group w-full"
            href={KnownPages.AppWorkerThread(worker.id, thread.id)} />
    );
}

function WorkersListEmptyPlaceholder() {
    return (
        <div>
            No workers
        </div>
    );
}

function WorkerThreadsList() {
    const threads = useWorkerThreads();

    return (
        <QueryList
            query={() => threads}
            itemRender={(item) => (<WorkerThreadsListItem worker={item.worker} thread={item.thread} />)}
            emptyPlaceholder={<WorkersListEmptyPlaceholder />}
        />
    );
}


export default function WorkerLayout({ children }: PropsWithChildren) {
    return (
        <div className="flex flex-row items-start">
            <WorkerThreadsList />
            {children}
        </div>
    )
}
