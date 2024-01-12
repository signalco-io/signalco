import { createTaskDefinition, getProcessIdByPublicId, getTaskDefinition, getTaskDefinitions } from '../../../../../src/lib/repo/processesRepository';
import { ensureUserId, optionalUserId } from '../../../../../src/lib/auth/apiAuth';
import { requiredParamString } from '../../../../../src/lib/api/apiParam';

export const runtime = 'edge';

export async function GET(_request: Request, { params }: { params: { id: string } }) {
    const processPublicId = requiredParamString(params.id);

    const { userId } = optionalUserId();

    const processId = await getProcessIdByPublicId(processPublicId);
    if (processId == null)
        return new Response(null, { status: 404 });

    const taskDefinitions = await getTaskDefinitions(userId, processId);
    const taskDefinitionsDto = taskDefinitions.map(p => ({
        ...p,
        id: p.publicId,
        publicId: undefined,
        processId: processPublicId
    }));
    return Response.json(taskDefinitionsDto);
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
    const processPublicId = requiredParamString(params.id);

    const data = await request.json();
    const text = data != null && typeof data === 'object' && 'text' in data && typeof data.text === 'string' ? data.text : '';

    const { userId } = ensureUserId();

    const processId = await getProcessIdByPublicId(processPublicId);
    if (processId == null)
        return new Response(null, { status: 404 });

    const id = await createTaskDefinition(userId, processId, text);
    const taskDefinition = await getTaskDefinition(userId, processId, id);
    return Response.json({ id: taskDefinition?.publicId });
}
