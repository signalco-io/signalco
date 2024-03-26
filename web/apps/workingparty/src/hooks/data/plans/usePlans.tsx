import { UseQueryResult, useQuery } from '@tanstack/react-query';
import { PlanDto } from '../../../lib/dtos/plan';

export function usePlans() {
    return useQuery({
        queryKey: ['plans'],
        queryFn: async () => {
            const response = await fetch('/api/plans');
            return await response.json() as PlanDto[];
        },
    });
}
