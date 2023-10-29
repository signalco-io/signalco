import { getProcessRuns, runProcess } from '../../../../../src/lib/repo/processesRepository';

export async function GET(_request: Request, { params }: { params: { id: string } }) {
    const processId = parseInt(params.id, 10);
    if (!processId)
        throw new Error('Missing process ID');

    return Response.json(getProcessRuns(processId));
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
    const processId = parseInt(params.id, 10);
    if (!processId)
        throw new Error('Missing process ID');

    const data = await request.json();
    const name = typeof data === 'object' && data != null && 'name' in data && typeof data.name === 'string' ? data.name.toString() : null;
    if (name == null)
        throw new Error('Missing name');

    return Response.json({ id: await runProcess(processId, name) });
}
