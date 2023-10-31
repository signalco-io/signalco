import { createTaskDefinition, getTaskDefinitions } from '../../../../../src/lib/repo/processesRepository';

export async function GET(_request: Request, { params }: { params: { id: string } }) {
    const processId = parseInt(params.id, 10);
    if (!processId)
        throw new Error('Missing process ID');

    return Response.json(await getTaskDefinitions(processId));
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
    const processId = parseInt(params.id, 10);
    if (!processId)
        throw new Error('Missing process ID');

    const data = await request.json();
    const text = data != null && typeof data === 'object' && 'text' in data && typeof data.text === 'string' ? data.text : '';
    const description = data != null && typeof data === 'object' && 'description' in data && typeof data.description === 'string' ? data.description : '';

    return Response.json({ id: await createTaskDefinition(processId, text, description) });
}
