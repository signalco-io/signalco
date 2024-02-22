import { threadsCreate, threadsGetAll } from '../../../../../src/lib/repository/threadsRepository';

export async function GET(_request: Request, { params }: { params: { workerid: string } }) {
    const { workerid } = params;
    return Response.json(await threadsGetAll(workerid));
}

export async function POST(_request: Request, { params }: { params: { workerid: string } }) {
    const { workerid } = params;
    return Response.json({
        id: await threadsCreate(workerid),
    });
}
