import { withAuth } from '../../../../workers/route';
import { stripeCustomerPaymentMethods } from '../../../../../../src/lib/stripe/serverStripe';
import { accountGet } from '../../../../../../src/lib/repository/accountsRepository';

export type AccountPaymentMethodsDto = ReturnType<typeof stripeCustomerPaymentMethods>;

export async function GET(_request: Request, { params }: { params: { accountId: string } }) {
    const { accountId } = params;
    if (!accountId)
        return new Response(null, { status: 400 });

    return await withAuth(async ({ accountId: authAccountId }) => {
        if (authAccountId !== accountId)
            return new Response(null, { status: 404 });

        const account = await accountGet(accountId);
        const info = await stripeCustomerPaymentMethods(account);

        return Response.json(info);
    });
}