'use client';

import { Fragment, useEffect, useRef, useState } from 'react';
import { Typography } from '@signalco/ui-primitives/Typography';
import { Stack } from '@signalco/ui-primitives/Stack';
import { Row } from '@signalco/ui-primitives/Row';
import { IconButton } from '@signalco/ui-primitives/IconButton';
import { Button } from '@signalco/ui-primitives/Button';
import { Down } from '@signalco/ui-icons';
import { Loadable } from '@signalco/ui/Loadable';
import { useScroll } from '@signalco/hooks/useScroll';
import { useThreadMessages } from '../../../../../../../../src/hooks/data/threads/useThreadMessages';
import { ThreadMessage } from './ThreadMessage';

export function WorkerThreadMessagesList({
    workerId, threadId, containerRef, onLoadingChanged
}: {
    workerId: string;
    threadId: string;
    containerRef: React.RefObject<HTMLDivElement | null>;
    onLoadingChanged?: (loading: boolean) => void;
}) {
    const [autoScroll, setAutoScroll] = useState(true);
    const lastMessageRef = useRef<HTMLDivElement>(null);

    const {
        data: messages, isLoading, isRefetching, error, fetchPreviousPage, isFetchingPreviousPage, hasPreviousPage,
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
    );
}
