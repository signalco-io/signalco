import { UseQueryResult, useQuery } from '@tanstack/react-query';
import { AccountPaymentMethodsDto } from '../../../../app/api/accounts/[accountId]/billing/payment-methods/route';

export function useAccountPaymentMethods(accountId: string | undefined) {
    return useQuery({
        queryKey: ['accounts', accountId, 'billing', 'paymentMethods'],
        queryFn: async () => {
            const response = await fetch(`/api/accounts/${accountId}/billing/payment-methods`);
            if (!response.ok)
                throw new Error('Failed to fetch account subscriptions');

            return await response.json() as AccountPaymentMethodsDto;
        },
        enabled: Boolean(accountId)
    });
}
