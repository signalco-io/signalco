import { withAuth } from '../../../workers/route';
import { accountSubscriptions } from '../../../../../src/lib/repository/accountsRepository';

export type SubscriptionDto = {
    id: string;
    plan?: {
        id: string;
        name: string;
    };
    active: boolean;
    price: number;
    currency: string;
    period: 'monthly' | 'yearly';
    start: string;
    end?: string;
    hasUpgradePath: boolean;
}

export async function GET(_request: Request, { params }: { params: { accountId: string } }) {
    const { accountId } = params;
    if (!accountId)
        return new Response(null, { status: 400 });

    return await withAuth(async ({ accountId: authAccountId }) => {
        if (authAccountId !== accountId)
            return new Response(null, { status: 404 });

        const subscriptions = await accountSubscriptions(accountId);

        const dto: SubscriptionDto[] = subscriptions.map(subscription => ({
            id: subscription.id,
            plan: subscription.plan
                ? {
                    id: subscription.plan.id,
                    name: subscription.plan.name
                }
                : undefined,
            active: subscription.active,
            price: subscription.price,
            currency: subscription.currency,
            period: subscription.period,
            start: new Date(subscription.createdAt * 1000).toISOString(),
            end: subscription.deactivatedAt ? new Date(subscription.deactivatedAt * 1000)?.toISOString() : undefined,
            hasUpgradePath: true
        }));

        return Response.json(dto)
    });
}