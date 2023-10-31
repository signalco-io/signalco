import { getTaskDefinition } from '../../../../../../src/lib/repo/processesRepository';

export async function GET(_request: Request, { params }: { params: { id: string, taskDefinitionId: string } }) {
    const processId = parseInt(params.id, 10);
    if (!processId)
        throw new Error('Missing process ID');

    const taskDefinitionId = parseInt(params.taskDefinitionId, 10);
    if (!taskDefinitionId)
        throw new Error('Missing task definition ID');

    return Response.json(await getTaskDefinition(processId, taskDefinitionId));
}
