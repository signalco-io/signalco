import { useMutation, useQueryClient } from '@tanstack/react-query';
import { taskKey, tasksKey } from './useProcessRunTasks';

type TaskUpdateBaseArgs = {
    processId: string;
    runId: string;
    taskId: string;
};

type TaskUpdateStatusArgs = TaskUpdateBaseArgs & {
    status: string;
}

type TaskUpdateArgs = TaskUpdateStatusArgs;

async function fetchPostProcess(processId: string, runId: string, taskId: string, data: object) {
    await fetch(`/api/processes/${processId}/runs/${runId}/tasks/${taskId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
}

export function useProcessRunTaskUpdate() {
    const client = useQueryClient();
    return useMutation({
        mutationFn: ({ processId, runId, taskId, ...rest }: TaskUpdateArgs) => fetchPostProcess(processId, runId, taskId, {
            processId,
            runId,
            taskId,
            ...rest
        }),
        onSuccess: (_, { processId, runId, taskId }: TaskUpdateArgs) => {
            client.invalidateQueries({ queryKey: tasksKey(processId, runId) });
            client.invalidateQueries({ queryKey: taskKey(processId, runId, taskId) });
        }
    });
}
