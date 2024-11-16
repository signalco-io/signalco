import { entityIdByPublicId } from '../../../../../../src/lib/repo/shared';
import { changeTaskDefinitionOrder, changeTaskDefinitionText, changeTaskDefinitionType, deleteTaskDefinition, getProcess, getTaskDefinition, getTaskDefinitionIdByPublicId } from '../../../../../../src/lib/repo/processesRepository';
import { documentCreate, documentGet } from '../../../../../../src/lib/repo/documentsRepository';
import { cosmosDataContainerProcesses } from '../../../../../../src/lib/db/client';
import { withAuth } from '../../../../../../src/lib/auth/auth';
import { optionalUserId } from '../../../../../../src/lib/auth/apiAuth';
import { requiredParamString } from '../../../../../../src/lib/api/apiParam';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string, taskDefinitionId: string }> }) {
    const { id, taskDefinitionId: paramTaskDefinitionId } = await params;
    const processPublicId = requiredParamString(id);
    const taskDefinitionPublicId = requiredParamString(paramTaskDefinitionId);

    const { userId } = optionalUserId();

    const processId = await entityIdByPublicId(cosmosDataContainerProcesses(), processPublicId);
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

export async function PUT(request: Request, { params }: { params: Promise<{ id: string, taskDefinitionId: string }> }) {
    const { id, taskDefinitionId: paramTaskDefinitionId } = await params;
    const processPublicId = requiredParamString(id);
    const taskDefinitionPublicId = requiredParamString(paramTaskDefinitionId);

    return await withAuth(async ({ accountId, userId }) => {
        const processId = await entityIdByPublicId(cosmosDataContainerProcesses(), processPublicId);
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
                    const documentId = await documentCreate(accountId, userId, documentName);
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
    });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string, taskDefinitionId: string }> }) {
    const { id, taskDefinitionId: paramTaskDefinitionId } = await params;
    const processPublicId = requiredParamString(id);
    const taskDefinitionPublicId = requiredParamString(paramTaskDefinitionId);

    return await withAuth(async ({ userId }) => {
        const processId = await entityIdByPublicId(cosmosDataContainerProcesses(), processPublicId);
        if (processId == null)
            return new Response(null, { status: 404 });
        const taskDefinitionId = await getTaskDefinitionIdByPublicId(processPublicId, taskDefinitionPublicId);
        if (taskDefinitionId == null)
            return new Response(null, { status: 404 });

        await deleteTaskDefinition(userId, processId, taskDefinitionId)
        return Response.json(null);
    });
}
