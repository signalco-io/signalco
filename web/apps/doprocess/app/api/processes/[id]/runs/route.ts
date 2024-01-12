import { getProcessIdByPublicId, getProcessRun, getProcessRuns, runProcess } from '../../../../../src/lib/repo/processesRepository';
import { ensureUserId } from '../../../../../src/lib/auth/apiAuth';
import { requiredParamString } from '../../../../../src/lib/api/apiParam';

export const runtime = 'edge';

export async function GET(_request: Request, { params }: { params: { id: string } }) {
    const processPublicId = requiredParamString(params.id);
    const { userId } = ensureUserId();
    const processId = await getProcessIdByPublicId(processPublicId);
    if (processId == null)
        return new Response(null, { status: 404 });
    const processRuns = await getProcessRuns(userId, processId);
    const processRunsDto = processRuns.map(p => ({
        ...p,
        id: p.publicId,
        publicId: undefined,
        processId: processPublicId
    }));
    return Response.json(processRunsDto);
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
    const processPublicId = requiredParamString(params.id);

    const data = await request.json();
    const name = typeof data === 'object' && data != null && 'name' in data && typeof data.name === 'string' ? data.name.toString() : null;
    if (name == null)
        throw new Error('Missing name');

    const { userId } = ensureUserId();

    const processId = await getProcessIdByPublicId(processPublicId);
    if (processId == null)
        return new Response(null, { status: 404 });

    const id = await runProcess(userId, processId, name);
    const processRun = await getProcessRun(userId, processId, Number(id));
    return Response.json({ id: processRun?.publicId });
}
