import { Message } from 'openai/resources/beta/threads/messages';
import { InfiniteData, UseInfiniteQueryResult, useInfiniteQuery } from '@tanstack/react-query';
import { orderBy } from '@signalco/js';

export type GetThreadMessagesPageParams = { after?: string, before?: string };

export async function getThreadMessages(workerId: string, threadId: string, pageParams: GetThreadMessagesPageParams) {
    const url = new URL(`/api/workers/${workerId}/threads/${threadId}/messages`, document.baseURI);
    if (pageParams.after)
        url.searchParams.set('after', pageParams.after);
    if (pageParams.before)
        url.searchParams.set('before', pageParams.before);

    const response = await fetch(url);
    if (response.status === 404)
        return null;

    const messages = await response.json() as Message[] | undefined;
    return messages ? orderBy(messages, (da, db) => da.created_at - db.created_at) : [];
}

export function useThreadMessages(workerId: string, threadId: string): UseInfiniteQueryResult<InfiniteData<Message[] | null, unknown>, Error> {
    return useInfiniteQuery({
        queryKey: ['threadMessages', threadId],
        queryFn: ({ pageParam }: { pageParam: GetThreadMessagesPageParams; }) => getThreadMessages(workerId, threadId, pageParam),
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
