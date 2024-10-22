import { entityIdByPublicId } from '../../../../../../src/lib/repo/shared';
import { deleteProcessRun, getProcessRun, getProcessRunIdByPublicId, renameProcessRun } from '../../../../../../src/lib/repo/processesRepository';
import { cosmosDataContainerProcesses } from '../../../../../../src/lib/db/client';
import { withAuth } from '../../../../../../src/lib/auth/auth';
import { optionalUserId } from '../../../../../../src/lib/auth/apiAuth';
import { requiredParamString } from '../../../../../../src/lib/api/apiParam';



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

export async function PUT(request: Request, { params }: { params: Promise<{ id: string, runId: string }> }) {
    const { id, runId } = await params;
    const processPublicId = requiredParamString(id);
    const runPublicId = requiredParamString(runId);

    return await withAuth(async ({ userId }) => {
        const processId = await entityIdByPublicId(cosmosDataContainerProcesses(), processPublicId);
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
    });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string, runId: string }> }) {
    const { id, runId } = await params;
    const processPublicId = requiredParamString(id);
    const runPublicId = requiredParamString(runId);

    return await withAuth(async ({ userId }) => {
        const processId = await entityIdByPublicId(cosmosDataContainerProcesses(), processPublicId);
        if (processId == null)
            return new Response(null, { status: 404 });
        const runId = await getProcessRunIdByPublicId(processPublicId, runPublicId);
        if (runId == null)
            return new Response(null, { status: 404 });

        await deleteProcessRun(userId, processId, runId);

        return Response.json(null);
    });
}
