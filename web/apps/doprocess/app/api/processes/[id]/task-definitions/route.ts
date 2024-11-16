import { entityIdByPublicId } from '../../../../../src/lib/repo/shared';
import { createTaskDefinition, getTaskDefinition, getTaskDefinitions } from '../../../../../src/lib/repo/processesRepository';
import { cosmosDataContainerProcesses } from '../../../../../src/lib/db/client';
import { withAuth } from '../../../../../src/lib/auth/auth';
import { optionalUserId } from '../../../../../src/lib/auth/apiAuth';
import { requiredParamString } from '../../../../../src/lib/api/apiParam';



export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const processPublicId = requiredParamString(id);

    const { userId } = optionalUserId();

    const processId = await entityIdByPublicId(cosmosDataContainerProcesses(), processPublicId);
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

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const processPublicId = requiredParamString(id);

    const data = await request.json();
    const text = data != null && typeof data === 'object' && 'text' in data && typeof data.text === 'string' ? data.text : '';

    return await withAuth(async ({ accountId, userId }) => {
        const processId = await entityIdByPublicId(cosmosDataContainerProcesses(), processPublicId);
        if (processId == null)
            return new Response(null, { status: 404 });

        const id = await createTaskDefinition(accountId, userId, processId, text);
        const taskDefinition = await getTaskDefinition(userId, processId, id);
        return Response.json({ id: taskDefinition?.publicId });
    });
}
