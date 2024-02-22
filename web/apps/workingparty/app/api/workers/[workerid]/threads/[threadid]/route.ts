import { threadsDelete, threadsGet } from '../../../../../../src/lib/repository/threadsRepository';

export async function GET(_request: Request, { params }: { params: { workerid: string, threadid: string } }) {
    const { threadid } = params;
    const dbItem = await threadsGet(threadid);
    if (!dbItem)
        return new Response(null, { status: 404 });

    return Response.json({
        id: dbItem.id,
        name: dbItem.name,
    });
}

export async function DELETE(_request: Request, { params }: { params: { workerid: string, threadid: string } }) {
    const { threadid } = params;
    await threadsDelete(threadid);
    return Response.json(null);
}
