'use client';

import { useRouter } from 'next/navigation';
import { Typography } from '@signalco/ui-primitives/Typography';
import { ListItem } from '@signalco/ui-primitives/ListItem';
import { Comment } from '@signalco/ui-icons';
import { KnownPages } from '../../../../../../src/knownPages';

type PartyWorkerThread = {
    id: string;
    name: string;
};

export type WorkerThreadListItemProps = {
    workerId: string;
    thread: PartyWorkerThread;
    selected: boolean;
};

export function WorkerThreadsListItem({ workerId, thread, selected }: WorkerThreadListItemProps) {
    const router = useRouter();
    return (
        <ListItem
            startDecorator={<Comment className="w-5 min-w-5 text-muted-foreground" />}
            label={(
                <Typography title={thread.name} noWrap>{thread.name}</Typography>
            )}
            className="group w-full"
            nodeId={thread.id}
            selected={selected}
            onSelected={(threadId) => router.push(KnownPages.AppWorkerThread(workerId, threadId))}
            onMouseEnter={() => router.prefetch(KnownPages.AppWorkerThread(workerId, thread.id))}
            variant="outlined" />
    );
}
