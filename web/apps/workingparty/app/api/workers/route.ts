import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { jwtSecret } from '../auth/login/confirm/route';
import { workersCreate, workersGetAll } from '../../../src/lib/repository/workersRepository';
import { usersGet } from '../../../src/lib/repository/usersRepository';

export async function ensureAuthUserId() {
    const sessionCookie = cookies().get('wp_session');
    if (!sessionCookie?.value)
        return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const result = await jwtVerify(sessionCookie.value, jwtSecret(), {
        issuer: 'urn:workingparty:issuer:api',
        audience: 'urn:workingparty:audience:web',
    });
    const userId = result.payload.sub;
    if (!userId || typeof userId !== 'string' || userId.length === 0)
        return Response.json({ error: 'Unauthorized' }, { status: 401 });

    return userId;
}

export async function withAuth(handler: (ctx: { userId: string, accountId: string }) => Promise<Response>) {
    const userIdOrResponse = await ensureAuthUserId();
    if (userIdOrResponse instanceof Response)
        return userIdOrResponse;
    const accountId = (await usersGet(userIdOrResponse)).accountIds[0];
    if (!accountId)
        return Response.json({ error: 'No account found for user' }, { status: 404 });

    return await handler({
        userId: userIdOrResponse,
        accountId
    });
}

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
        Response.json({
            id: await workersCreate({ accountId, marketplaceWorkerId }),
        }));
}
