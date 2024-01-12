import { deleteProcessRun, getProcessIdByPublicId, getProcessRun, getProcessRunIdByPublicId, renameProcessRun } from '../../../../../../src/lib/repo/processesRepository';
import { ensureUserId, optionalUserId } from '../../../../../../src/lib/auth/apiAuth';
import { requiredParamString } from '../../../../../../src/lib/api/apiParam';

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

    const processRun = await getProcessRun(userId, processId, runId);
    if (!processRun)
        return new Response(null, { status: 404 });
    const processRunDto = {
        ...processRun,
        id: processRun.publicId,
        publicId: undefined,
        processId: processPublicId,
        runId: runPublicId
    };
    return Response.json(processRunDto);
}

export async function PUT(request: Request, { params }: { params: { id: string, runId: string } }) {
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
    if (data != null && typeof data === 'object' && 'name' in data && typeof data.name === 'string') {
        await renameProcessRun(userId, processId, runId, data.name);
    }

    return Response.json(null);
}

export async function DELETE(_request: Request, { params }: { params: { id: string, runId: string } }) {
    const processPublicId = requiredParamString(params.id);
    const runPublicId = requiredParamString(params.runId);

    const { userId } = ensureUserId();

    const processId = await getProcessIdByPublicId(processPublicId);
    if (processId == null)
        return new Response(null, { status: 404 });
    const runId = await getProcessRunIdByPublicId(processPublicId, runPublicId);
    if (runId == null)
        return new Response(null, { status: 404 });

    await deleteProcessRun(userId, processId, runId);

    return Response.json(null);
}
