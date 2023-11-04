import { useQuery } from '@tanstack/react-query';
import { Task } from '../lib/db/schema';
import { processRunKey } from './useProcessRun';

export function taskKey(processId?: string, runId?: string, taskId?: string) {
    if (taskId == null)
        return [...processRunKey(processId, runId), 'tasks'];
    return [...processRunKey(processId, runId), 'tasks', taskId];
}

export function tasksKey(processId?: string, runId?: string) {
    return [...processRunKey(processId, runId), 'tasks'];
}

async function fetchGetProcessRunTasks(processId: string, runId: string) {
    const response = await fetch(`/api/processes/${processId}/runs/${runId}/tasks`);
    return await response.json() as Task[] | undefined;
}

export function useProcessRunTasks(processId?: string, runId?: string) {
    return useQuery({
        queryKey: tasksKey(processId, runId),
        queryFn: async () => {
            if (!processId || !runId)
                throw new Error('Process Id and Run Id is required');
            return await fetchGetProcessRunTasks(processId, runId);
        },
        enabled: processId != null && runId != null,
    })
}
