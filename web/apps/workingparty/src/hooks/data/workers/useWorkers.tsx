import { type UseQueryResult, useQuery } from '@tanstack/react-query';

export function useWorkers(): UseQueryResult<{
    id: string;
    name: string;
}[], Error> {
    return useQuery({
        queryKey: ['workers'],
        queryFn: async () => {
            const response = await fetch('/api/workers');
            return await response.json() as { id: string; name: string; }[];
        }
    });
}
