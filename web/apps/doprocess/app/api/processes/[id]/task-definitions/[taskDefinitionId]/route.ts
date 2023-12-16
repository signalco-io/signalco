import { changeTaskDefinitionOrder, changeTaskDefinitionText, changeTaskDefinitionType, deleteTaskDefinition, getProcess, getProcessIdByPublicId, getTaskDefinition, getTaskDefinitionIdByPublicId } from '../../../../../../src/lib/repo/processesRepository';
import { documentCreate, documentGet } from '../../../../../../src/lib/repo/documentsRepository';
import { ensureUserId, optionalUserId } from '../../../../../../src/lib/auth/apiAuth';
import { requiredParamString } from '../../../../../../src/lib/api/apiParam';

export async function GET(_request: Request, { params }: { params: { id: string, taskDefinitionId: string } }) {
    const processPublicId = requiredParamString(params.id);
    const taskDefinitionPublicId = requiredParamString(params.taskDefinitionId);

    const { userId } = optionalUserId();

    const processId = await getProcessIdByPublicId(processPublicId);
    if (processId == null)
        return new Response(null, { status: 404 });
    const taskDefinitionId = await getTaskDefinitionIdByPublicId(processPublicId, taskDefinitionPublicId);
    if (taskDefinitionId == null)
        return new Response(null, { status: 404 });

    const taskDefinition = await getTaskDefinition(userId, processId, taskDefinitionId);
    if (!taskDefinition)
        return new Response(null, { status: 404 });

    const taskDefinitionDto = {
        ...taskDefinition,
        id: taskDefinition.publicId,
        publicId: undefined,
        processId: processPublicId
    };
    return Response.json(taskDefinitionDto);
}

export async function PUT(request: Request, { params }: { params: { id: string, taskDefinitionId: string } }) {
    const processPublicId = requiredParamString(params.id);
    const taskDefinitionPublicId = requiredParamString(params.taskDefinitionId);

    const { userId } = ensureUserId();

    const processId = await getProcessIdByPublicId(processPublicId);
    if (processId == null)
        return new Response(null, { status: 404 });
    const taskDefinitionId = await getTaskDefinitionIdByPublicId(processPublicId, taskDefinitionPublicId);
    if (taskDefinitionId == null)
        return new Response(null, { status: 404 });

    const data = await request.json();
    if (data != null && typeof data === 'object') {
        // Update text (name)
        if ('text' in data && typeof data.text === 'string') {
            await changeTaskDefinitionText(userId, processId, taskDefinitionId, data.text);
        }

        // Update type
        if ('type' in data && typeof data.type === 'string') {
            const type = data.type;
            let typeData = ('typeData' in data && typeof data.typeData === 'string') ? data.typeData : null;
            if (!typeData && type === 'document') {
                const process = await getProcess(userId, processId);
                const taskDefinition = await getTaskDefinition(userId, processId, taskDefinitionId);
                const documentName = [process?.name, taskDefinition?.text ?? 'New document'].filter(Boolean).join(' - ');
                const documentId = await documentCreate(userId, documentName);
                const document = await documentGet(userId, documentId);
                if (document) {
                    typeData = document?.publicId;
                }
            } else if (type === 'blank') {
                typeData = 'blank';
            }
            if (!typeData) {
                throw new Error('Invalid type');
            }

            await changeTaskDefinitionType(userId, processId, taskDefinitionId, type, typeData);
        }

        // Update order
        if ('order' in data && typeof data.order === 'string') {
            await changeTaskDefinitionOrder(userId, processId, taskDefinitionId, data.order);
        }
    }

    return Response.json(null);
}

export async function DELETE(_request: Request, { params }: { params: { id: string, taskDefinitionId: string } }) {
    const processPublicId = requiredParamString(params.id);
    const taskDefinitionPublicId = requiredParamString(params.taskDefinitionId);

    const { userId } = ensureUserId();

    const processId = await getProcessIdByPublicId(processPublicId);
    if (processId == null)
        return new Response(null, { status: 404 });
    const taskDefinitionId = await getTaskDefinitionIdByPublicId(processPublicId, taskDefinitionPublicId);
    if (taskDefinitionId == null)
        return new Response(null, { status: 404 });

    await deleteTaskDefinition(userId, processId, taskDefinitionId)
    return Response.json(null);
}
