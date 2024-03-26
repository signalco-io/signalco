import { UseQueryResult, useQuery } from '@tanstack/react-query';
import { SubscriptionDto } from '../../../lib/dtos/subscription';

export function useAccountSubscriptions(accountId: string | undefined) {
    return useQuery({
        queryKey: ['accounts', accountId, 'subscriptions'],
        queryFn: async () => {
            const response = await fetch(`/api/accounts/${accountId}/subscriptions`);
            if (!response.ok)
                throw new Error('Failed to fetch account subscriptions');

            const data = await response.json() as SubscriptionDto[];
            return data.map(subscription => ({
                ...subscription,
                start: new Date(subscription.start),
                end: subscription.end ? new Date(subscription.end) : undefined,
            }));
        },
        enabled: Boolean(accountId),
    });
}
