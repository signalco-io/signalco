import { redirect } from 'next/navigation';
import { stripeCreatePortal } from '../../../../../../src/lib/stripe/serverStripe';
import { accountGet } from '../../../../../../src/lib/repository/accountsRepository';
import { withAuth } from '../../../../../../src/lib/auth/withAuth';

export const dynamic = 'force-dynamic';

export async function GET(_request: Request, { params }: { params: Promise<{ accountId: string }> }) {
    const { accountId } = await params;
    if (!accountId)
        return new Response(null, { status: 400 });

    return await withAuth(async ({ accountId: authAccountId }) => {
        if (authAccountId !== accountId)
            return new Response(null, { status: 404 });

        const account = await accountGet(accountId);
        if (!account)
            return new Response(null, { status: 404 });

        const portalUrl = await stripeCreatePortal(account);
        if (!portalUrl)
            return new Response(null, { status: 400 });

        return redirect(portalUrl);
    });
}