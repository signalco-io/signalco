import { UseQueryResult, useQuery } from '@tanstack/react-query';
import { AccountUsageDto } from '../../../../app/api/accounts/[accountId]/usage/route';

export function useAccountUsage(accountId: string | undefined) {
    return useQuery({
        queryKey: ['accounts', accountId, 'usage'],
        queryFn: async () => {
            const response = await fetch(`/api/accounts/${accountId}/usage`);
            if (!response.ok)
                throw new Error('Failed to fetch account usage');

            const data = await response.json() as AccountUsageDto;
            return {
                ...data,
                period: {
                    start: data.period.start ? new Date(data.period.start) : undefined,
                    end: data.period.end ? new Date(data.period.end) : undefined,
                },
            };
        },
        enabled: Boolean(accountId),
    });
}


