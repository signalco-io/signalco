import { completeTask } from '../../../../../../../../src/lib/repo/processesRepository';

export async function PUT(request: Request, { params }: { params: { id: string, runId: string, taskId: string } }) {
    const taskId = parseInt(params.taskId, 10);
    if (!taskId)
        throw new Error('Missing task ID');

    const data = await request.json();
    if (data != null && typeof data === 'object' && 'status' in data && typeof data.status === 'string' && data.status === 'completed') {
        await completeTask(taskId);
    }

    return Response.json(null);
}
