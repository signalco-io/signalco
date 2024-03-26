import { type UseQueryResult, useQuery } from '@tanstack/react-query';

export function useWorkers(): UseQueryResult<{
    id: string;
    name: string;
}[], Error> {
    return useQuery({
        queryKey: ['workers'],
        queryFn: async () => {
            const response = await fetch('/api/workers');
            if (response.status < 200 || response.status > 299) {
                throw new Error('Failed to request workers');
            }
            return await response.json() as { id: string; name: string; }[];
        }
    });
}
