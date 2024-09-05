import { getAllProcessesRuns, getProcesses } from '../../../../src/lib/repo/processesRepository';
import { withAuth } from '../../../../src/lib/auth/auth';



export async function GET() {
    return await withAuth(async ({ userId }) => {
        const processRuns = await getAllProcessesRuns(userId);
        const processes = await getProcesses(userId);
        const processRunsDto = processRuns.map(p => ({
            ...p,
            id: p.publicId,
            publicId: undefined,
            processId: processes.find(pr => pr.id === p.processId)?.publicId
        }));
        return Response.json(processRunsDto);
    });
}
