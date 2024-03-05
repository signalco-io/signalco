import { type UseQueryResult, useQuery } from '@tanstack/react-query';

export function useWorkerThreads(workerId: string): UseQueryResult<{
    id: string;
    name: string;
    assignedWorkers: string[];
}[], Error> {
    return useQuery({
        queryKey: ['workers', workerId, 'threads'],
        queryFn: async () => {
            const response = await fetch(`/api/workers/${workerId}/threads`);
            return await response.json() as { id: string; name: string; assignedWorkers: string[]; }[];
        }
    });
}
