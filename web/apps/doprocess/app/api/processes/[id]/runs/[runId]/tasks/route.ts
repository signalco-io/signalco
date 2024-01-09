import { getProcessIdByPublicId, getProcessRunIdByPublicId, getTaskDefinitionIdByPublicId, getTaskDefinitions, getTasks, setTaskState } from '../../../../../../../src/lib/repo/processesRepository';
import { ensureUserId, optionalUserId } from '../../../../../../../src/lib/auth/apiAuth';
import { requiredParamString } from '../../../../../../../src/lib/api/apiParam';

export const runtime = 'edge';

export async function GET(_request: Request, { params }: { params: { id: string, runId: string } }) {
    const processPublicId = requiredParamString(params.id);
    const runPublicId = requiredParamString(params.runId);
    const { userId } = optionalUserId();

    const processId = await getProcessIdByPublicId(processPublicId);
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

export async function POST(request: Request, { params }: { params: { id: string, runId: string } }) {
    const processPublicId = requiredParamString(params.id);
    const runPublicId = requiredParamString(params.runId);
    const { userId } = ensureUserId();

    const processId = await getProcessIdByPublicId(processPublicId);
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

        await setTaskState(userId, processId, runId, taskDefinitionId, data.state);
    }

    return Response.json(null);
}
