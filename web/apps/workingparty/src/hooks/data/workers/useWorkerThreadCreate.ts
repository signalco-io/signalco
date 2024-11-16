import { type UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query';

export function useWorkerThreadCreate(workerId: string): UseMutationResult<{
    id: string;
}, Error, void, unknown> {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async () => {
            const response = await fetch(`/api/workers/${workerId}/threads`, { method: 'POST' });
            return await response.json() as { id: string; };
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['workers', workerId, 'threads'] });
        }
    });
}
