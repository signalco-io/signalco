import { accountUsageScope } from '../../../../../../src/lib/repository/accountsRepository';
import { withAuth } from '../../../../../../src/lib/auth/withAuth';

export const dynamic = 'force-dynamic';

export async function GET(_request: Request, { params }: { params: Promise<{ accountId: string, scope: string }> }) {
    const { accountId, scope } = await params;
    if (!accountId || !scope)
        return new Response(null, { status: 400 });

    // Validate scope
    if (scope !== 'messages' && scope !== 'workers' && scope !== 'oaigpt35tokens')
        return new Response(null, { status: 400 });

    return await withAuth(async ({ accountId: authAccountId }) => {
        if (authAccountId !== accountId)
            return new Response(null, { status: 404 });

        const usage = await accountUsageScope(accountId, scope);

        return Response.json(usage);
    });
}