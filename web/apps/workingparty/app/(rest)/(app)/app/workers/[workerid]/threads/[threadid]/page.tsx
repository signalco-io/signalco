'use client';

import { forwardRef, useEffect, useRef } from 'react';
import { ThreadMessage } from 'openai/resources/beta/threads/messages/messages.mjs';
import { useQuery } from '@tanstack/react-query';
import { Stack } from '@signalco/ui-primitives/Stack';
import { cx } from '@signalco/ui-primitives/cx';
import { Container } from '@signalco/ui-primitives/Container';
import { Loadable } from '@signalco/ui/Loadable';
import { orderBy } from '@signalco/js';
import { ThreadMessageInput } from './ThreadMessageInput';

async function getThreadMessages(workerId: string, threadId: string) {
    const response = await fetch('/api/workers/' + workerId + '/threads/' + threadId + '/messages');
    if (response.status === 404)
        return null;
    return await response.json() as ThreadMessage[] | undefined;
}

function useThreadMessages(workerId: string, threadId: string) {
    return useQuery({
        queryKey: ['threadMessages', { threadId }],
        queryFn: () => getThreadMessages(workerId, threadId),
        select: data => data ? orderBy(data, (da, db) => da.created_at - db.created_at) : []
    });
}

const ThreadMessage = forwardRef<HTMLDivElement, { message: ThreadMessage }>(({ message }: { message: ThreadMessage }, ref) => {
    const { role, content: contents } = message;

    console.log('message', message, ref);

    return (
        <div
            ref={ref}
            className={cx(
                'max-w-[80%] rounded-md border bg-muted p-2',
                role === 'assistant' ? 'self-start dark:bg-slate-700' : 'self-end',
            )}>
            {contents?.map((content, j) => (
                <div key={j}>
                    {content.type === 'text' && content.text?.value}
                    {content.type === 'image_file' && <div>Image: {content.image_file?.file_id}</div>}
                </div>
            ))}
        </div>
    )
});
ThreadMessage.displayName = 'ThreadMessage';

export default function WorkerThreadPage({ params }: { params: { workerid: string, threadid: string } }) {
    const { workerid, threadid } = params;
    const { data: messages, isLoading, error } = useThreadMessages(workerid, threadid);
    const lastMessageRef = useRef<HTMLDivElement>(null);

    useEffect(function scrollToLastMessageOnNewMessages() {
        lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="flex h-screen flex-col overflow-hidden p-2 py-0">
            <Container maxWidth="md" padded className="overflow-auto">
                <Loadable
                    isLoading={isLoading}
                    error={error}
                    loadingLabel="Loading messages...">
                    <Stack spacing={1} className="py-2">
                        {messages?.map((message, i) => {
                            const isLast = i === messages.length - 1;
                            console.log('islast', i, isLast, message)
                            return (
                                <ThreadMessage
                                    key={message.id}
                                    message={message}
                                    ref={isLast ? lastMessageRef : null} />
                            );
                        })}
                    </Stack>
                </Loadable>
            </Container>
            <div className="py-2">
                <ThreadMessageInput
                    workerId={workerid}
                    threadId={threadid} />
            </div>
        </div>
    )
}
