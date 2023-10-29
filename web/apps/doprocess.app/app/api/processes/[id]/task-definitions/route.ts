import { createTaskDefinition, getTaskDefinitions } from '../../../../../src/lib/repo/processesRepository';

export async function GET(_request: Request, { params }: { params: { id: string } }) {
    const processId = parseInt(params.id, 10);
    if (!processId)
        throw new Error('Missing process ID');

    return Response.json(await getTaskDefinitions(processId));
}

export async function POST(_request: Request, { params }: { params: { id: string } }) {
    const processId = parseInt(params.id, 10);
    if (!processId)
        throw new Error('Missing process ID');

    return Response.json({ id: await createTaskDefinition(processId, '', '') });
}
