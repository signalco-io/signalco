import { withAuth } from '../../../../workers/route';
import { accountUsageScope } from '../../../../../../src/lib/repository/accountsRepository';

export async function GET(_request: Request, { params }: { params: { accountId: string, scope: string } }) {
    const { accountId, scope } = params;
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