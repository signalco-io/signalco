import { stripeCheckout } from '../../../../../../../src/lib/stripe/serverStripe';
import { plansGet } from '../../../../../../../src/lib/repository/plansRepository';
import { accountGet } from '../../../../../../../src/lib/repository/accountsRepository';
import { withAuth } from '../../../../../../../src/lib/auth/withAuth';

export const dynamic = 'force-dynamic';

export type CheckoutSessionDto = Awaited<ReturnType<typeof stripeCheckout>>;

export async function GET(_request: Request, { params }: { params: { accountId: string, planId: string } }) {
    const { accountId, planId } = params;
    if (!accountId || !planId)
        return new Response(null, { status: 400 });

    return await withAuth(async ({ accountId: authAccountId }) => {
        if (authAccountId !== accountId)
            return new Response(null, { status: 404 });

        const plan = await plansGet(planId);
        if (!plan)
            return new Response(null, { status: 404 });

        // TODO: Check if account is eligable for selected price

        const account = await accountGet(accountId);
        if (!account)
            return new Response(null, { status: 404 });

        const session = await stripeCheckout(account, plan.stripePriceId);
        if (!session)
            return new Response(null, { status: 400 });

        return Response.json(session);
    });
}