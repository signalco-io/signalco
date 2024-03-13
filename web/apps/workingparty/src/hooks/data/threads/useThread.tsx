import { UseQueryResult, useQuery } from '@tanstack/react-query';

export function useThread(workerId: string, threadId: string): UseQueryResult<{
    id: string;
    name: string;
}, Error> {
    return useQuery({
        queryKey: ['workers', workerId, 'threads', threadId],
        queryFn: async () => {
            const response = await fetch(`/api/workers/${workerId}/threads/${threadId}`);
            return await response.json() as { id: string; name: string; };
        },
        enabled: Boolean(threadId) && Boolean(workerId)
    });
}
