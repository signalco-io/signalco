'use client';

import { useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Typography } from '@signalco/ui-primitives/Typography';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@signalco/ui-primitives/Menu';
import { IconButton } from '@signalco/ui-primitives/IconButton';
import { Container } from '@signalco/ui-primitives/Container';
import { Settings } from '@signalco/ui-icons';
import { ModalConfirm } from '@signalco/ui/ModalConfirm';
import { KnownPages } from '../../../../../../../../src/knownPages';
import { useThreadDelete } from '../../../../../../../../src/hooks/data/threads/useThreadDelete';
import { useThread } from '../../../../../../../../src/hooks/data/threads/useThread';
import { WorkerThreadMessagesList } from './WorkerThreadMessagesList';
import { ThreadMessageInput } from './ThreadMessageInput';

export default function WorkerThreadPage() {
    const params = useParams<{ workerid: string, threadid: string }>();
    const { workerid, threadid } = params;
    const router = useRouter();
    const containerRef = useRef<HTMLDivElement>(null);
    const [messagesLoading, setMessagesLoading] = useState(false);

    const { data: thread } = useThread(workerid, threadid);

    const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
    const deleteThread = useThreadDelete(workerid, threadid);
    const handleDeleteConfirm = async () => {
        await deleteThread.mutateAsync();
        router.push(KnownPages.AppWorker(workerid));
    }

    return (
        <>
            <div className="relative h-full overflow-hidden py-0">
                <div className="flex h-14 flex-row items-center justify-between overflow-hidden border-b px-4">
                    <Typography level="body1">{thread?.name}</Typography>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <IconButton variant="plain" title="Thread options...">
                                <Settings color="gray" />
                            </IconButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem
                                onClick={() => setShowDeleteConfirmModal(true)}
                                className="flex items-center">
                                Delete thread...
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <div className="h-[calc(100%-56px)] overflow-y-auto [scroll-padding-bottom:60px]" ref={containerRef}>
                    <Container maxWidth="md" padded>
                        <WorkerThreadMessagesList
                            workerId={workerid}
                            threadId={threadid}
                            containerRef={containerRef}
                            onLoadingChanged={setMessagesLoading} />
                    </Container>
                </div>
                <div className="absolute bottom-4 left-1/2 w-full -translate-x-1/2">
                    <Container maxWidth="sm" className="p-2">
                        <ThreadMessageInput
                            workerId={workerid}
                            threadId={threadid}
                            isLoading={messagesLoading} />
                    </Container>
                </div>
            </div>
            <ModalConfirm
                title="Delete Thread"
                header={'Delete Thread'}
                open={showDeleteConfirmModal}
                onOpenChange={setShowDeleteConfirmModal}
                color="danger"
                expectedConfirm={thread?.name ?? 'delete'}
                promptLabel={`To confirm, type the thread name "${thread?.name}" and confirm.`}
                onConfirm={handleDeleteConfirm}>
                Are you sure you want to delete this thread? This action cannot be undone.
            </ModalConfirm>
        </>
    )
}
