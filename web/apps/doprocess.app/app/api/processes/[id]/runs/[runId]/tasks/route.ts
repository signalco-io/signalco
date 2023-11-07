import { getTasks } from '../../../../../../../src/lib/repo/processesRepository';
import { ensureUserId } from '../../../../../../../src/lib/auth/apiAuth';
import { requiredParamNumber } from '../../../../../../../src/lib/api/apiParam';

export async function GET(_request: Request, { params }: { params: { id: string, runId: string } }) {
    const processId = requiredParamNumber(params.id);
    const runId = requiredParamNumber(params.runId);
    const { userId } = ensureUserId();
    return Response.json(await getTasks(userId, processId, runId));
}
