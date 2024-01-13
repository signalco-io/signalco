import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import { authPatsAsync } from '../../../auth/pats/AuthPatsRepository';

export function allAuthPatsKey() {
    return ['auth-pats'];
}

export function useAllAuthPats() {
    return useQuery({
        queryKey: allAuthPatsKey(),
        queryFn: async () => await authPatsAsync() ?? undefined,
        staleTime: 60 * 1000
    });
}
