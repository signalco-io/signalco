import { entityIdByPublicId } from '../../../../../../../src/lib/repo/shared';
import { getProcessRunIdByPublicId, getTaskDefinitionIdByPublicId, getTaskDefinitions, getTasks, setTaskState } from '../../../../../../../src/lib/repo/processesRepository';
import { cosmosDataContainerProcesses } from '../../../../../../../src/lib/db/client';
import { withAuth } from '../../../../../../../src/lib/auth/auth';
import { optionalUserId } from '../../../../../../../src/lib/auth/apiAuth';
import { requiredParamString } from '../../../../../../../src/lib/api/apiParam';



export async function GET(_request: Request, { params }: { params: Promise<{ id: string, runId: string }> }) {
    const { id, runId: paramRunId } = await params;
    const processPublicId = requiredParamString(id);
    const runPublicId = requiredParamString(paramRunId);
    const { userId } = optionalUserId();

    const processId = await entityIdByPublicId(cosmosDataContainerProcesses(), processPublicId);
    if (processId == null)
        return new Response(null, { status: 404 });
    const runId = await getProcessRunIdByPublicId(processPublicId, runPublicId);
    if (runId == null)
        return new Response(null, { status: 404 });

    const taskDefinitions = await getTaskDefinitions(userId, processId);

    const tasks = await getTasks(userId, processId, runId);
    const tasksDto = tasks.map(p => ({
        ...p,
        id: p.publicId,
        publicId: undefined,
        processId: processPublicId,
        runId: runPublicId,
        taskDefinitionId: taskDefinitions.find(t => t.id === p.taskDefinitionId)?.publicId
    }));
    return Response.json(tasksDto);
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string, runId: string }> }) {
    const { id, runId } = await params;
    const processPublicId = requiredParamString(id);
    const runPublicId = requiredParamString(runId);
    return await withAuth(async ({ accountId, userId }) => {
        const processId = await entityIdByPublicId(cosmosDataContainerProcesses(), processPublicId);
        if (processId == null)
            return new Response(null, { status: 404 });
        const runId = await getProcessRunIdByPublicId(processPublicId, runPublicId);
        if (runId == null)
            return new Response(null, { status: 404 });

        const data = await request.json();

        let taskDefinitionPublicId = null;
        if (data != null && typeof data === 'object' && 'taskDefinitionId' in data && typeof data.taskDefinitionId === 'string') {
            taskDefinitionPublicId = data.taskDefinitionId;
        }
        if (taskDefinitionPublicId == null)
            return new Response('Task definition ID is required', { status: 400 });
        const taskDefinitionId = await getTaskDefinitionIdByPublicId(processPublicId, taskDefinitionPublicId);
        if (taskDefinitionId == null)
            return new Response(null, { status: 404 });

        if (data != null && typeof data === 'object' && 'state' in data && typeof data.state === 'string') {
            if (data.state !== 'new' && data.state !== 'completed')
                return Response.json('Invalid status', { status: 400 });

            await setTaskState(accountId, userId, processId, runId, taskDefinitionId, data.state);
        }

        return Response.json(null);
    });
}
