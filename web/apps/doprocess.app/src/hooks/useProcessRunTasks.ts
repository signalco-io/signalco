import { UseQueryResult, useQuery } from '@tanstack/react-query';
import { ProcessRunTaskDto } from '../../app/api/dtos/dtos';
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
    if (response.status === 404)
        return null;
    return await response.json() as ProcessRunTaskDto[] | undefined;
}

export function useProcessRunTasks(processId?: string, runId?: string): UseQueryResult<ProcessRunTaskDto[] | null | undefined, Error> {
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
