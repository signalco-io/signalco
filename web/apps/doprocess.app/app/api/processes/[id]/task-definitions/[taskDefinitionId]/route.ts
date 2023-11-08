import { changeTaskDefinitionText, changeTaskDefinitionType, deleteTaskDefinition, getProcess, getTaskDefinition } from '../../../../../../src/lib/repo/processesRepository';
import { documentCreate } from '../../../../../../src/lib/repo/documentsRepository';
import { ensureUserId } from '../../../../../../src/lib/auth/apiAuth';
import { requiredParamNumber } from '../../../../../../src/lib/api/apiParam';

export async function GET(_request: Request, { params }: { params: { id: string, taskDefinitionId: string } }) {
    const processId = requiredParamNumber(params.id);
    const taskDefinitionId = requiredParamNumber(params.taskDefinitionId);

    const { userId } = ensureUserId();

    const taskDefinition = await getTaskDefinition(userId, processId, taskDefinitionId);
    if (!taskDefinition)
        return new Response(null, { status: 404 });
    return Response.json(taskDefinition);
}

export async function PUT(request: Request, { params }: { params: { id: string, taskDefinitionId: string } }) {
    const processId = requiredParamNumber(params.id);
    const taskDefinitionId = requiredParamNumber(params.taskDefinitionId);

    const { userId } = ensureUserId();

    const data = await request.json();
    if (data != null && typeof data === 'object') {
        if ('text' in data && typeof data.text === 'string') {
            await changeTaskDefinitionText(userId, processId, taskDefinitionId, data.text);
        }
        if ('type' in data && typeof data.type === 'string') {
            let typeData = 'typeData' in data && typeof data.typeData === 'string' ? data.typeData : null;
            if (!typeData && data.type === 'document') {
                const process = await getProcess(userId, processId);
                const taskDefinition = await getTaskDefinition(userId, processId, taskDefinitionId);
                // TODO: Use publicId instead of internalId for dataType
                typeData = (await documentCreate(userId, [process?.name, taskDefinition?.text ?? 'New document'].filter(Boolean).join(' - '))).toString();
            } else if (data.type === 'blank') {
                typeData = 'blank';
            }
            if (!typeData) {
                throw new Error('Invalid type');
            }

            await changeTaskDefinitionType(userId, processId, taskDefinitionId, data.type, typeData);
        }
    }

    return Response.json(null);
}

export async function DELETE(_request: Request, { params }: { params: { id: string, taskDefinitionId: string } }) {
    const processId = requiredParamNumber(params.id);
    const taskDefinitionId = requiredParamNumber(params.taskDefinitionId);

    const { userId } = ensureUserId();

    await deleteTaskDefinition(userId, processId, taskDefinitionId)
    return Response.json(null);
}
