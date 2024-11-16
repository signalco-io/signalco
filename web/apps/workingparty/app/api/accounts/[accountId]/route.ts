import { accountGet, accountUpdate } from '../../../../src/lib/repository/accountsRepository';
import { withAuth } from '../../../../src/lib/auth/withAuth';

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

        return Response.json({
            id: account.id,
            name: account.name,
            createdAt: account.createdAt
        });
    });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ accountId: string }> }) {
    const { accountId } = await params;
    if (!accountId)
        return new Response(null, { status: 400 });

    return await withAuth(async ({ accountId: authAccountId }) => {
        if (authAccountId !== accountId)
            return new Response(null, { status: 404 });

        const body = await request.json();
        if (typeof body === 'object' && body && 'name' in body && typeof body.name === 'string') {
            if (body.name.length < 1) {
                return Response.json({ message: 'Name must not be empty' }, { status: 400 });
            }

            await accountUpdate(accountId, {
                name: body.name
            });
        }

        return Response.json(null);
    });
}