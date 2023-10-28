import { revalidatePath } from 'next/cache';
import { completeTask } from '../../../src/lib/repo/processesRepository';

export const updateTaskStateFormAction = async (data: FormData) => {
    const taskId = parseInt(data.get('taskId')?.toString() ?? '', 10);
    if (!taskId) {
        throw new Error('Task ID is required');
    }

    const checked = data.get('checked') === 'true';

    console.debug(`Changed task ${taskId} with checked=${checked}`);

    if (checked) {
        await completeTask(taskId);
    }

    const processId = data.get('processId')?.toString();
    revalidatePath(`/processes/${processId}`);
};
