'use client';

import { PropsWithChildren, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Typography } from '@signalco/ui-primitives/Typography';
import { Tooltip } from '@signalco/ui-primitives/Tooltip';
import { Stack } from '@signalco/ui-primitives/Stack';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@signalco/ui-primitives/Menu';
import { ListHeader } from '@signalco/ui-primitives/List';
import { IconButton } from '@signalco/ui-primitives/IconButton';
import { Comment, Settings } from '@signalco/ui-icons';
import { SplitView } from '@signalco/ui/SplitView';
import { QueryList, QueryListItem } from '@signalco/ui/QueryList';
import { ModalConfirm } from '@signalco/ui/ModalConfirm';
import { KnownPages } from '../../../../../../src/knownPages';
import { useWorkerThreads } from '../../../../../../src/hooks/data/workers/useWorkerThreads';
import { useWorkerThreadCreate } from '../../../../../../src/hooks/data/workers/useWorkerThreadCreate';

function useWorker(workerId: string) {
    return useQuery({
        queryKey: ['workers', workerId],
        queryFn: async () => {
            const response = await fetch(`/api/workers/${workerId}`);
            return await response.json() as { id: string, name: string };
        }
    });
}

type PartyWorkerThread = {
    id: string;
    name: string;
};

type WorkerThreadListItemProps = {
    workerId: string;
    thread: PartyWorkerThread;
    selected: boolean;
};

export function WorkerThreadsListItem({ workerId, thread, selected }: WorkerThreadListItemProps) {
    const router = useRouter();
    return (
        <QueryListItem
            startDecorator={<Comment className="w-5 min-w-5 text-muted-foreground" />}
            label={(
                <Tooltip title={thread.name}>
                    <Typography noWrap>{thread.name}</Typography>
                </Tooltip>
            )}
            className="group w-full"
            nodeId={thread.id}
            selected={selected}
            onSelected={(threadId) => router.push(KnownPages.AppWorkerThread(workerId, threadId))}
            onMouseEnter={() => router.prefetch(KnownPages.AppWorkerThread(workerId, thread.id))}
        />
    );
}

function WorkersListEmptyPlaceholder() {
    return (
        <div>
            No Threads
        </div>
    );
}

function WorkerThreadsList({ workerId, selectedThreadId }: { workerId: string, selectedThreadId?: string }) {
    const threads = useWorkerThreads(workerId);
    const threadCreate = useWorkerThreadCreate(workerId);
    const router = useRouter();

    const handleNewThread = async () => {
        const createResponse = await threadCreate.mutateAsync();
        router.push(KnownPages.AppWorkerThread(workerId, createResponse.id));
    }

    return (
        <QueryList
            query={() => threads}
            itemRender={(item) => (<WorkerThreadsListItem workerId={workerId} thread={item} selected={selectedThreadId === item.id} />)}
            emptyPlaceholder={<WorkersListEmptyPlaceholder />}
            editable
            onEditing={handleNewThread}
        />
    );
}

function useWorkerDelete(workerId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async () => {
            await fetch(`/api/workers/${workerId}`, { method: 'DELETE' });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['workers'] });
        }
    });
}

export default function WorkerLayout({ children, params }: PropsWithChildren & { params: { workerid: string } }) {
    const { workerid } = params;
    const router = useRouter();
    const { data: worker } = useWorker(workerid);
    const pathname = usePathname();
    const selectedThreadId = pathname.split('/')[5];
    console.log('WorkerLayout', workerid, selectedThreadId);

    const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
    const deleteThread = useWorkerDelete(workerid);
    const handleDeleteConfirm = async () => {
        await deleteThread.mutateAsync();
        router.push(KnownPages.App);
    }

    return (
        <>
            <SplitView>
                <Stack>
                    <div className="flex items-center p-2">
                        <ListHeader
                            header={worker?.name}
                            actions={([
                                <DropdownMenu key="filter-actions">
                                    <DropdownMenuTrigger asChild>
                                        <IconButton variant="plain">
                                            <Settings color="gray" />
                                        </IconButton>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem
                                            onClick={() => setShowDeleteConfirmModal(true)}
                                            className="flex items-center">
                                            Delete worker...
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ])} />
                    </div>
                    <div className="p-2">
                        <WorkerThreadsList workerId={workerid} selectedThreadId={selectedThreadId} />
                    </div>
                </Stack>
                <div className="h-full">
                    {children}
                </div>
            </SplitView>
            <ModalConfirm
                open={showDeleteConfirmModal}
                onOpenChange={setShowDeleteConfirmModal}
                header={'Delete thread'}
                color="danger"
                expectedConfirm={worker?.name ?? 'delete'}
                promptLabel={`Are you sure you want to delete this worker? This action cannot be undone. To confirm, type the worker name "${worker?.name}" and confirm.`}
                onConfirm={handleDeleteConfirm} />
        </>
    )
}
