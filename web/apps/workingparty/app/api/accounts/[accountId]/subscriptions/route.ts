import { accountSubscriptions } from '../../../../../src/lib/repository/accountsRepository';
import { SubscriptionDto } from '../../../../../src/lib/dtos/subscription';
import { withAuth } from '../../../../../src/lib/auth/withAuth';

export const dynamic = 'force-dynamic';

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