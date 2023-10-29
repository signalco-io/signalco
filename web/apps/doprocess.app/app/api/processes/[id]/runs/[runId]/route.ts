import { getProcessRun } from '../../../../../../src/lib/repo/processesRepository';

export async function GET(_request: Request, { params }: { params: { id: string, runId: string } }) {
    const processId = parseInt(params.id, 10);
    if (!processId)
        throw new Error('Missing process ID');

    const runId = parseInt(params.runId, 10);
    if (!runId)
        throw new Error('Missing run ID');

    return Response.json(await getProcessRun(processId, runId));
}
