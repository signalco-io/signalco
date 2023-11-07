import { getProcess, renameProcess } from '../../../../src/lib/repo/processesRepository';
import { ensureUserId } from '../../../../src/lib/auth/apiAuth';
import { requiredParamNumber } from '../../../../src/lib/api/apiParam';

export async function GET(_request: Request, { params }: { params: { id: string } }) {
    const processId = requiredParamNumber(params.id);

    const { userId } = ensureUserId();

    return Response.json(await getProcess(userId, processId));
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    const processId = requiredParamNumber(params.id);
    const { userId } = ensureUserId();

    const data = await request.json();
    if (data != null && typeof data === 'object' && 'name' in data && typeof data.name === 'string') {
        await renameProcess(userId, processId, data.name);
    }

    return Response.json(null);
}
