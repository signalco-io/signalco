import { withAuth } from '../../../../workers/route';
import { stripeCustomerBillingInfo } from '../../../../../../src/lib/stripe/serverStripe';
import { usersGet } from '../../../../../../src/lib/repository/usersRepository';

export async function GET(_request: Request, { params }: { params: { accountId: string } }) {
    const { accountId } = params;
    if (!accountId)
        return new Response(null, { status: 400 });

    return await withAuth(async ({ userId, accountId: authAccountId }) => {
        if (authAccountId !== accountId)
            return new Response(null, { status: 404 });

        const user = await usersGet(userId);
        await stripeCustomerBillingInfo(user);

        return Response.json(null);
    });
}