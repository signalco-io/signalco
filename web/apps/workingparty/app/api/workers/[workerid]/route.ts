import { workersDelete, workersGet } from '../../../../src/lib/repository/workersRepository';
import { withAuth } from '../../../../src/lib/auth/withAuth';

export const dynamic = 'force-dynamic';

export async function GET(_request: Request, { params }: { params: Promise<{ workerid: string }> }) {
    const { workerid } = await params;
    if (!workerid)
        return new Response(null, { status: 400 });

    return await withAuth(async ({ accountId }) => {
        const dbItem = await workersGet(accountId, workerid);
        if (!dbItem)
            return new Response(null, { status: 404 });

        return Response.json({
            id: dbItem.id,
            name: dbItem.name,
        });
    });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ workerid: string }> }) {
    const { workerid } = await params;
    if (!workerid)
        return new Response(null, { status: 400 });

    return await withAuth(async ({ accountId }) => {
        await workersDelete(accountId, workerid);
        return Response.json(null);
    });
}
