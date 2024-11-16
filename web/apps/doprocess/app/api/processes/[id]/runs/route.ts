import { entityIdByPublicId } from '../../../../../src/lib/repo/shared';
import { getProcessRun, getProcessRuns, runProcess } from '../../../../../src/lib/repo/processesRepository';
import { cosmosDataContainerProcesses } from '../../../../../src/lib/db/client';
import { withAuth } from '../../../../../src/lib/auth/auth';
import { requiredParamString } from '../../../../../src/lib/api/apiParam';



export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const processPublicId = requiredParamString(id);
    return await withAuth(async ({ userId }) => {
        const processId = await entityIdByPublicId(cosmosDataContainerProcesses(), processPublicId);
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
    });
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const processPublicId = requiredParamString(id);

    const data = await request.json();
    const name = typeof data === 'object' && data != null && 'name' in data && typeof data.name === 'string' ? data.name.toString() : null;
    if (name == null)
        throw new Error('Missing name');

    return await withAuth(async ({ accountId, userId }) => {
        const processId = await entityIdByPublicId(cosmosDataContainerProcesses(), processPublicId);
        if (processId == null)
            return new Response(null, { status: 404 });

        const id = await runProcess(accountId, userId, processId, name);
        const processRun = await getProcessRun(userId, processId, id);
        return Response.json({ id: processRun?.publicId });
    });
}
