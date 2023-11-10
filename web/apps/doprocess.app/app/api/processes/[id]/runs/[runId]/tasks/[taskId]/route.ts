import { getProcessIdByPublicId, getProcessRunIdByPublicId, getProcessRunTaskIdByPublicId, setTaskState } from '../../../../../../../../src/lib/repo/processesRepository';
import { ensureUserId } from '../../../../../../../../src/lib/auth/apiAuth';
import { requiredParamString } from '../../../../../../../../src/lib/api/apiParam';

export async function PUT(request: Request, { params }: { params: { id: string, runId: string, taskId: string } }) {
    const processPublicId = requiredParamString(params.id);
    const runPublicId = requiredParamString(params.runId);
    const taskPublicId = requiredParamString(params.taskId);
    const { userId } = ensureUserId();

    const processId = await getProcessIdByPublicId(processPublicId);
    if (processId == null)
        return new Response(null, { status: 404 });
    const runId = await getProcessRunIdByPublicId(processPublicId, runPublicId);
    if (runId == null)
        return new Response(null, { status: 404 });
    const taskId = await getProcessRunTaskIdByPublicId(processPublicId, runPublicId, taskPublicId);
    if (taskId == null)
        return new Response(null, { status: 404 });

    const data = await request.json();
    if (data != null && typeof data === 'object' && 'status' in data && typeof data.status === 'string') {
        if (data.status !== 'new' && data.status !== 'completed')
            return Response.json('Invalid status', { status: 400 });

        await setTaskState(userId, processId, runId, taskId, data.status);
    }

    return Response.json(null);
}
