import { UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query';

export function useThreadDelete(workerId: string, threadId: string): UseMutationResult<void, Error, void, unknown> {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async () => {
            await fetch(`/api/workers/${workerId}/threads/${threadId}`, { method: 'DELETE' });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['workers', workerId, 'threads'] });
        }
    });
}
