import { getAllProcessesRuns, getProcesses } from '../../../../src/lib/repo/processesRepository';
import { ensureUserId } from '../../../../src/lib/auth/apiAuth';

export const runtime = 'edge';

export async function GET() {
    const { userId } = ensureUserId();
    const processRuns = await getAllProcessesRuns(userId);
    const processes = await getProcesses(userId);
    const processRunsDto = processRuns.map(p => ({
        ...p,
        id: p.publicId,
        publicId: undefined,
        processId: processes.find(pr => pr.id === p.processId)?.publicId
    }));
    return Response.json(processRunsDto);
}
