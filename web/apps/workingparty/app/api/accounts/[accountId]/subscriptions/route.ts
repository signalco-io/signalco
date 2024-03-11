import { withAuth } from '../../../workers/route';
import { PlanDto } from '../../../plans/route';
import { accountSubscriptions } from '../../../../../src/lib/repository/accountsRepository';

export type SubscriptionDto = {
    id: string;
    plan?: PlanDto;
    active: boolean;
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
                    active: subscription.plan.active,
                    name: subscription.plan.name,
                    currency: subscription.plan.currency,
                    price: subscription.plan.price,
                    period: subscription.plan.period,
                    limits: subscription.plan.limits
                } : undefined,
            active: !subscription.deactivatedAt || subscription.deactivatedAt > Date.now() / 1000,
            start: new Date(subscription.createdAt * 1000).toISOString(),
            end: subscription.deactivatedAt ? new Date(subscription.deactivatedAt * 1000)?.toISOString() : undefined,
            hasUpgradePath: true
        }));

        return Response.json(dto)
    });
}