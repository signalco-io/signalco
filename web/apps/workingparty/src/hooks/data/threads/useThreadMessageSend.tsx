import { Message } from 'openai/resources/beta/threads/messages';
import { UseMutationResult, useMutation, useQueryClient, QueryClient, QueryKey } from '@tanstack/react-query';
import { User } from '../../../components/providers/AppAuthProvider';
import { useCurrentUser } from '../../../../../../packages/auth-client/src/useCurrentUser';

export async function sendThreadMessage(workerId: string, threadId: string, message: string) {
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

export function useThreadMessageSend(workerId: string, threadId: string): UseMutationResult<{ runId: string; updatedThread?: boolean; }, Error, string, {
    previousItems: unknown;
}> {
    const client = useQueryClient();
    const currentUser = useCurrentUser<User>();
    return useMutation({
        mutationFn: (message: string) => sendThreadMessage(workerId, threadId, message),
        onMutate: async (newItem) => ({
            previousItems: await handleArrayOptimisticInsert<Message, Message>(client, ['threadMessages', threadId], {
                id: 'optimistic',
                content: [
                    { type: 'text', text: { value: newItem, annotations: [] } }
                ],
                role: 'user',
                created_at: Date.now() / 1000, // to UNIX seconds
                assistant_id: workerId,
                attachments: null,
                thread_id: threadId,
                metadata: null,
                object: 'thread.message',
                run_id: null,
                completed_at: Date.now() / 1000, // to UNIX seconds
                incomplete_at: null,
                incomplete_details: null,
                status: 'completed'
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
            if (currentUser.data?.user?.accountIds) {
                for (const accountId of currentUser.data.user.accountIds) {
                    client.invalidateQueries({ queryKey: ['accounts', accountId, 'usage'] });
                }
            }
        }
    });
}
