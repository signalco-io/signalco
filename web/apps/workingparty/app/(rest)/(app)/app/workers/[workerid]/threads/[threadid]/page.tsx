'use client';

import { Fragment, useEffect, useRef, useState } from 'react';
import { ThreadMessage as OAIThreadMessage } from 'openai/resources/beta/threads/messages/messages.mjs';
import { useRouter } from 'next/navigation';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Typography } from '@signalco/ui-primitives/Typography';
import { Stack } from '@signalco/ui-primitives/Stack';
import { Row } from '@signalco/ui-primitives/Row';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@signalco/ui-primitives/Menu';
import { IconButton } from '@signalco/ui-primitives/IconButton';
import { Container } from '@signalco/ui-primitives/Container';
import { Button } from '@signalco/ui-primitives/Button';
import { Down, Settings } from '@signalco/ui-icons';
import { ModalConfirm } from '@signalco/ui/ModalConfirm';
import { Loadable } from '@signalco/ui/Loadable';
import { orderBy } from '@signalco/js';
import { useScroll } from '@signalco/hooks/useScroll';
import { KnownPages } from '../../../../../../../../src/knownPages';
import { ThreadMessageInput } from './ThreadMessageInput';
import { ThreadMessage } from './ThreadMessage';

type GetThreadMessagesPageParams = { after?: string, before?: string };

async function getThreadMessages(workerId: string, threadId: string, pageParams: GetThreadMessagesPageParams) {
    const url = new URL(`/api/workers/${workerId}/threads/${threadId}/messages`, document.baseURI);
    if (pageParams.after)
        url.searchParams.set('after', pageParams.after);
    if (pageParams.before)
        url.searchParams.set('before', pageParams.before);

    const response = await fetch(url);
    if (response.status === 404)
        return null;

    const messages = await response.json() as OAIThreadMessage[] | undefined;
    return messages ? orderBy(messages, (da, db) => da.created_at - db.created_at) : [];
}

function useThreadMessages(workerId: string, threadId: string) {
    return useInfiniteQuery({
        queryKey: ['threadMessages', threadId],
        queryFn: ({ pageParam }: { pageParam: GetThreadMessagesPageParams }) => getThreadMessages(workerId, threadId, pageParam),
        initialPageParam: { after: undefined, before: undefined } as GetThreadMessagesPageParams,
        getNextPageParam: (lastPage) => {
            if (lastPage?.length ?? 0 < 25)
                return null;
            return ({ after: undefined, before: !lastPage?.length ? undefined : lastPage[lastPage.length - 1]?.id });
        },
        getPreviousPageParam: (firstPage) => {
            if (firstPage?.length ?? 0 < 25)
                return null;
            return ({ after: !firstPage?.length ? undefined : firstPage[0]?.id, before: undefined });
        },
        enabled: Boolean(threadId) && Boolean(workerId),
        retryOnMount: false // Avoids infinite loop when changing pages/threads
    });
}

function useThread(workerId: string, threadId: string) {
    return useQuery({
        queryKey: ['workers', workerId, 'threads', threadId],
        queryFn: async () => {
            const response = await fetch(`/api/workers/${workerId}/threads/${threadId}`);
            return await response.json() as { id: string, name: string };
        },
        enabled: Boolean(threadId) && Boolean(workerId)
    });
}

function useThreadDelete(workerId: string, threadId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async () => {
            await fetch(`/api/workers/${workerId}/threads/${threadId}`, { method: 'DELETE' });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['workers', workerId, 'threads'] });
        }
    });
}

function WorkerThreadMessagesList({
    workerId, threadId, containerRef, onLoadingChanged
}: {
    workerId: string;
    threadId: string;
    containerRef: React.RefObject<HTMLDivElement>;
    onLoadingChanged?: (loading: boolean) => void;
}) {
    const [autoScroll, setAutoScroll] = useState(true);
    const lastMessageRef = useRef<HTMLDivElement>(null);

    const {
        data: messages,
        isLoading,
        isRefetching,
        error,
        fetchPreviousPage,
        isFetchingPreviousPage,
        hasPreviousPage,
    } = useThreadMessages(workerId, threadId);
    const flatMessages = messages?.pages.flatMap(m => m).filter(Boolean);

    useEffect(() => {
        onLoadingChanged?.(isLoading || isRefetching);
    }, [isLoading, isRefetching, onLoadingChanged]);

    function scrollToBottom(smooth?: boolean) {
        lastMessageRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'instant' });
    }

    useEffect(function scrollToLastMessageOnNewMessages() {
        if (autoScroll)
            scrollToBottom();
    }, [autoScroll, messages]);

    // Load previous page when scrolled to top
    const conatinerScrollOffset = useScroll(containerRef);
    useEffect(() => {
        // Toggle auto-scroll based on scroll position
        if (conatinerScrollOffset + (containerRef.current?.clientHeight ?? 0) === containerRef.current?.scrollHeight)
            setAutoScroll(true);
        else if (flatMessages?.length ?? 0 > 0)
            setAutoScroll(false);
    }, [conatinerScrollOffset, containerRef, flatMessages?.length]);

    const handleScrollToBottom = () => {
        scrollToBottom(true);
    };

    return (
        <Loadable
            isLoading={isLoading}
            error={error}
            loadingLabel="Loading messages...">
            <Stack spacing={1} className="py-2 pb-24">
                {hasPreviousPage && (
                    <Row spacing={2} className="justify-center py-8">
                        <Button variant="plain" onClick={() => fetchPreviousPage()} loading={isFetchingPreviousPage}>
                            Load more messages
                        </Button>
                    </Row>
                )}
                {flatMessages?.map((message, i) => (
                    <Fragment key={message.id}>
                        {i === 0 || message.created_at - (flatMessages[i - 1]?.created_at ?? 0) > 3600 ? (
                            <Typography
                                level="body1"
                                className="py-8 text-center font-semibold text-muted-foreground">
                                {new Date(message.created_at * 1000).toLocaleString()}
                            </Typography>
                        ) : null}
                        <ThreadMessage
                            message={message}
                            ref={i === flatMessages.length - 1 ? lastMessageRef : null} />
                    </Fragment>
                ))}
            </Stack>
            {!autoScroll && (
                <IconButton className="absolute bottom-7 z-10" onClick={handleScrollToBottom}>
                    <Down />
                </IconButton>
            )}
        </Loadable>
    )
}

export default function WorkerThreadPage({ params }: { params: { workerid: string, threadid: string } }) {
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
                    <Typography level="h6">{thread?.name}</Typography>
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
                open={showDeleteConfirmModal}
                onOpenChange={setShowDeleteConfirmModal}
                header={'Delete thread'}
                color="danger"
                expectedConfirm={thread?.name ?? 'delete'}
                promptLabel={`Are you sure you want to delete this thread? This action cannot be undone. To confirm, type the thread name "${thread?.name}" and confirm.`}
                onConfirm={handleDeleteConfirm} />
        </>
    )
}
