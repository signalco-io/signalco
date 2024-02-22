import { workersDelete, workersGet } from '../../../../src/lib/repository/workersRepository';

export async function GET(_request: Request, { params }: { params: { workerid: string } }) {
    const { workerid } = params;
    const dbItem = await workersGet(workerid);
    if (!dbItem)
        return new Response(null, { status: 404 });

    return Response.json({
        id: dbItem.id,
        name: dbItem.name,
    });
}

export async function DELETE(_request: Request, { params }: { params: { workerid: string } }) {
    const { workerid } = params;
    await workersDelete(workerid);
    return Response.json(null);
}
