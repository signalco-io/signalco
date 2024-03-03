'use client';

import { ThreadMessage as OAIThreadMessage } from 'openai/resources/beta/threads/messages/messages.mjs';
import { QueryClient, QueryKey, UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query';
import { Tooltip } from '@signalco/ui-primitives/Tooltip';
import { Input } from '@signalco/ui-primitives/Input';
import { IconButton } from '@signalco/ui-primitives/IconButton';
import { Send } from '@signalco/ui-icons';
import { FormEvent } from 'react';

async function sendThreadMessage(workerId: string, threadId: string, message: string) {
    const response = await fetch('/api/workers/' + workerId + '/threads/' + threadId + '/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message })
    });
    return await response.json() as { runId: string, updatedThread?: boolean };
}

// TODO: Dedupe (extract to package)
export async function handleArrayOptimisticInsert<T, TNew>(client: QueryClient, key: QueryKey, newItem: TNew) {
    await client.cancelQueries({ queryKey: key });
    const previousItems = client.getQueryData(key);
    client.setQueryData(key, (old: { pages: T[][] }) => {
        console.log(old);
        return old
            ? { ...old, pages: old.pages.map((page, i) => i === old.pages.length - 1 ? [...page, newItem] : page) }
            : { pageParams: [''], pages: [[newItem]] }; // page params for default infinite query
    });
    return previousItems;
}

function useThreadMessageSend(workerId: string, threadId: string): UseMutationResult<{ runId: string, updatedThread?: boolean }, Error, string, {
    previousItems: unknown;
}> {
    const client = useQueryClient();
    return useMutation({
        mutationFn: (message: string) => sendThreadMessage(workerId, threadId, message),
        onMutate: async (newItem) => ({
            previousItems: await handleArrayOptimisticInsert<OAIThreadMessage, OAIThreadMessage>(client, ['threadMessages', threadId], {
                id: 'optimistic',
                content: [
                    { type: 'text', text: { value: newItem, annotations: [] } }
                ],
                role: 'user',
                created_at: new Date().getTime() / 1000, // to UNIX seconds
                assistant_id: workerId,
                file_ids: [],
                thread_id: threadId,
                metadata: null,
                object: 'thread.message',
                run_id: null
            })
        }),
        onError: (_, __, context) => {
            if (context?.previousItems) {
                client.setQueryData(['threadMessages', threadId], context.previousItems);
            }
        },
        onSuccess: (a) => {
            client.invalidateQueries({ queryKey: ['threadMessages', threadId] });
            if (a.updatedThread) {
                client.invalidateQueries({ queryKey: ['workers', workerId, 'threads'] });
            }
        }
    });
}

export function ThreadMessageInput({ workerId, threadId, isLoading }: { workerId: string, threadId: string, isLoading?: boolean }) {
    const { mutateAsync: sendThreadMessage, isPending } = useThreadMessageSend(workerId, threadId);

    const handleMessage = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const message = formData.get('message')?.toString();
        if (!message) return;

        await sendThreadMessage(message);
    }

    return (
        <form onSubmit={handleMessage}>
            <Input
                type="text"
                name="message"
                disabled={isLoading || isPending}
                className="bg-muted"
                autoComplete="off"
                placeholder="Enter message..."
                fullWidth
                endDecorator={(
                    <Tooltip title="Send message">
                        <IconButton
                            type="submit"
                            variant="plain"
                            disabled={isLoading || isPending}
                            loading={isLoading || isPending}>
                            <Send />
                        </IconButton>
                    </Tooltip>
                )} />
        </form>
    );
}
