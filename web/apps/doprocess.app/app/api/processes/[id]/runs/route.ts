import { getProcessRuns, runProcess } from '../../../../../src/lib/repo/processesRepository';
import { ensureUserId } from '../../../../../src/lib/auth/apiAuth';
import { requiredParamNumber } from '../../../../../src/lib/api/apiParam';

export async function GET(_request: Request, { params }: { params: { id: string } }) {
    const processId = requiredParamNumber(params.id);
    const { userId } = ensureUserId();
    return Response.json(getProcessRuns(userId, processId));
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
    const processId = requiredParamNumber(params.id);

    const data = await request.json();
    const name = typeof data === 'object' && data != null && 'name' in data && typeof data.name === 'string' ? data.name.toString() : null;
    if (name == null)
        throw new Error('Missing name');

    const { userId } = ensureUserId();

    return Response.json({ id: await runProcess(userId, processId, name) });
}
