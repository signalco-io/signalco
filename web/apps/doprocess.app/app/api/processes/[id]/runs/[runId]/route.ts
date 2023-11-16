import { deleteProcessRun, getProcessIdByPublicId, getProcessRun, getProcessRunIdByPublicId } from '../../../../../../src/lib/repo/processesRepository';
import { ensureUserId } from '../../../../../../src/lib/auth/apiAuth';
import { requiredParamString } from '../../../../../../src/lib/api/apiParam';

export async function GET(_request: Request, { params }: { params: { id: string, runId: string } }) {
    const processPublicId = requiredParamString(params.id);
    const runPublicId = requiredParamString(params.runId);

    const { userId } = ensureUserId();

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
