import { UseQueryResult, useQuery } from '@tanstack/react-query';
import { AccountBillingInfoDto } from '../../../../app/api/accounts/[accountId]/billing/info/route';

export function useAccountBillingInfo(accountId: string | undefined) {
    return useQuery({
        queryKey: ['accounts', accountId, 'billing', 'info'],
        queryFn: async () => {
            const response = await fetch(`/api/accounts/${accountId}/billing/info`);
            if (!response.ok)
                throw new Error('Failed to fetch account billing');

            return await response.json() as AccountBillingInfoDto;
        },
        enabled: Boolean(accountId)
    })
}
