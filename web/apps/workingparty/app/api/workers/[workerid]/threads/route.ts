import { threadsCreate, threadsGetAll } from '../../../../../src/lib/repository/threadsRepository';
import { withAuth } from '../../../../../src/lib/auth/withAuth';

export const dynamic = 'force-dynamic';

export async function GET(_request: Request, { params }: { params: { workerid: string } }) {
    const { workerid } = params;
    if (!workerid)
        return new Response(null, { status: 400 });

    return await withAuth(async ({ accountId }) =>
        Response.json(await threadsGetAll(accountId, workerid)));
}

export async function POST(_request: Request, { params }: { params: { workerid: string } }) {
    const { workerid } = params;
    if (!workerid)
        return new Response(null, { status: 400 });

    return await withAuth(async ({ accountId }) =>
        Response.json({
            id: await threadsCreate(accountId, workerid),
        }));
}
