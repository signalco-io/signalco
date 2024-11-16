import { type UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query';
import { authPatCreateAsync } from '../../../auth/pats/AuthPatsRepository';
import { allAuthPatsKey } from './useAuthPats';

export function useCreateAuthPat() {
    const client = useQueryClient();
    return useMutation({
        mutationFn: (data: { alias?: string, expire?: Date }) => authPatCreateAsync(data.alias, data.expire),
        onSuccess: () => {
            client.invalidateQueries({ queryKey: allAuthPatsKey() });
        }
    });
}
