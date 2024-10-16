import { stripeCustomerPaymentMethods } from '../../../../../../src/lib/stripe/serverStripe';
import { accountGet } from '../../../../../../src/lib/repository/accountsRepository';
import { withAuth } from '../../../../../../src/lib/auth/withAuth';

export type AccountPaymentMethodsDto = ReturnType<typeof stripeCustomerPaymentMethods>;

export const dynamic = 'force-dynamic';

export async function GET(_request: Request, { params }: { params: { accountId: string } }) {
    const { accountId } = params;
    if (!accountId)
        return new Response(null, { status: 400 });

    return await withAuth(async ({ accountId: authAccountId }) => {
        if (authAccountId !== accountId)
            return new Response(null, { status: 404 });

        const account = await accountGet(accountId);
        if (!account)
            return new Response(null, { status: 404 });

        const info = await stripeCustomerPaymentMethods(account);

        return Response.json(info);
    });
}