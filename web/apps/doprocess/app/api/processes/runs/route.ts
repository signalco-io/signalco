import { ProcessRunDto } from '../../dtos/dtos';
import { getAllProcessesRuns, getProcesses } from '../../../../src/lib/repo/processesRepository';
import { ensureUserId } from '../../../../src/lib/auth/apiAuth';

export async function GET() {
    const { userId } = ensureUserId();
    const processRuns = await getAllProcessesRuns(userId);
    const processes = await getProcesses(userId);
    const processRunsDto = processRuns.map(p => {
        const processPublicId = processes.find(pr => pr.id === p.processId)?.publicId;
        if (!processPublicId) {
            throw new Error(`Process with id ${p.processId} not found`);
        }

        return ({
            ...p,
            id: p.publicId,
            publicId: undefined,
            processId: processPublicId
        });
    }) satisfies ProcessRunDto[];

    return Response.json(processRunsDto);
}
