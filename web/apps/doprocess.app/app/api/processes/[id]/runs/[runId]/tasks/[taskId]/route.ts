import { setTaskState } from '../../../../../../../../src/lib/repo/processesRepository';
import { ensureUserId } from '../../../../../../../../src/lib/auth/apiAuth';
import { requiredParamNumber } from '../../../../../../../../src/lib/api/apiParam';

export async function PUT(request: Request, { params }: { params: { id: string, runId: string, taskId: string } }) {
    const processId = requiredParamNumber(params.id);
    const runId = requiredParamNumber(params.runId);
    const taskId = requiredParamNumber(params.taskId);
    const { userId } = ensureUserId();
    const data = await request.json();
    if (data != null && typeof data === 'object' && 'status' in data && typeof data.status === 'string' && data.status === 'completed') {
        await setTaskState(userId, processId, runId, taskId, 'completed');
    }

    return Response.json(null);
}
