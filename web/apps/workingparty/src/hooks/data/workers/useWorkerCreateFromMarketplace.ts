import { UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query';

export function useWorkerCreateFromMarketplace(marketplaceWorkerId: string): UseMutationResult<{
    id: string;
}, Error, void, unknown> {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async () => {
            const response = await fetch('/api/workers', {
                method: 'POST',
                body: JSON.stringify({ marketplaceWorkerId })
            });
            return await response.json() as { id: string };
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['workers'] });
        }
    });
}
