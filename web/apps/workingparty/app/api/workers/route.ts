import { workersCreate, workersGetAll } from '../../../src/lib/repository/workersRepository';
import { accountUsageOverLimit } from '../../../src/lib/repository/accountsRepository';
import { withAuth } from '../../../src/lib/auth/withAuth';

export const dynamic = 'force-dynamic';

export async function GET() {
    return withAuth(async ({ accountId }) =>
        Response.json(await workersGetAll(accountId)));
}

export async function POST(request: Request) {
    const json = await request.json();
    let marketplaceWorkerId: string | undefined = undefined;
    if (json && typeof json === 'object' && 'marketplaceWorkerId' in json && typeof json.marketplaceWorkerId === 'string') {
        marketplaceWorkerId = json.marketplaceWorkerId;
    }

    if (!marketplaceWorkerId)
        return Response.json({ error: 'Invalid request' }, { status: 400 });

    return withAuth(async ({ accountId }) =>
    {
        if (await accountUsageOverLimit(accountId, 'workers'))
            return Response.json({ error: 'You exceeded your current quota, please check your plan and billing details' }, { status: 429 });

        return Response.json({
            id: await workersCreate({ accountId, marketplaceWorkerId }),
        });
    });
}
