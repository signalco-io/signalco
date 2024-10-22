import { threadsDelete, threadsGet } from '../../../../../../src/lib/repository/threadsRepository';
import { withAuth } from '../../../../../../src/lib/auth/withAuth';

export const dynamic = 'force-dynamic';

export async function GET(_request: Request, { params }: { params: Promise<{ workerid: string, threadid: string }> }) {
    const { threadid } = await params;
    if (!threadid)
        return new Response(null, { status: 400 });

    return await withAuth(async ({ accountId }) => {
        const dbItem = await threadsGet(accountId, threadid);
        if (!dbItem)
            return new Response(null, { status: 404 });

        return Response.json({
            id: dbItem.id,
            name: dbItem.name,
        });
    });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ workerid: string, threadid: string }> }) {
    const { threadid } = await params;
    if (!threadid)
        return new Response(null, { status: 400 });

    return await withAuth(async ({ accountId }) => {
        await threadsDelete(accountId, threadid);
        return Response.json(null);
    });
}
