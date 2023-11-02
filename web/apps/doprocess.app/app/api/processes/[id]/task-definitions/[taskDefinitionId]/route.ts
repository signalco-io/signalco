import { deleteTaskDefinition, getTaskDefinition } from '../../../../../../src/lib/repo/processesRepository';

export async function GET(_request: Request, { params }: { params: { id: string, taskDefinitionId: string } }) {
    const processId = parseInt(params.id, 10);
    if (!processId)
        throw new Error('Missing process ID');

    const taskDefinitionId = parseInt(params.taskDefinitionId, 10);
    if (!taskDefinitionId)
        throw new Error('Missing task definition ID');

    const taskDefinition = await getTaskDefinition(processId, taskDefinitionId);
    if (!taskDefinition)
        return new Response(null, { status: 404 });
    return Response.json(taskDefinition);
}

export async function DELETE(_request: Request, { params }: { params: { id: string, taskDefinitionId: string } }) {
    const taskDefinitionId = parseInt(params.taskDefinitionId, 10);
    if (!taskDefinitionId)
        throw new Error('Missing task definition ID');

    await deleteTaskDefinition(taskDefinitionId)
    return Response.json(null);
}
