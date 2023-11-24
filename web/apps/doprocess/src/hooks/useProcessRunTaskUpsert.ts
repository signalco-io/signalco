import { UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query';
import { handleArrayOptimisticUpdate } from '../helpers/queryHelpers';
import { tasksKey } from './useProcessRunTasks';

type TaskCreateArgs = {
    processId: string;
    runId: string;
    taskDefinitionId: string;
    state?: string;
}

async function fetchPostProcessRunTask(processId: string, runId: string, data: object) {
    await fetch(`/api/processes/${processId}/runs/${runId}/tasks`, {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export function useProcessRunTaskUpsert(): UseMutationResult<void, Error, TaskCreateArgs, {
    previousItems: unknown;
}> {
    const client = useQueryClient();
    return useMutation({
        mutationFn: ({ processId, runId, ...rest }: TaskCreateArgs) => fetchPostProcessRunTask(processId, runId, { processId, runId, ...rest }),
        onMutate: async (newItem) => ({
            previousItems: await handleArrayOptimisticUpdate(client, tasksKey(newItem.processId, newItem.runId), newItem, (curr: TaskCreateArgs) => curr.taskDefinitionId === newItem.taskDefinitionId)
        }),
        onError: (_, { processId, runId }, context) => {
            if (context?.previousItems) {
                client.setQueryData(tasksKey(processId, runId), context.previousItems);
            }
        },
        onSuccess: (_, {processId, runId}: TaskCreateArgs) => {
            client.invalidateQueries({ queryKey: tasksKey(processId, runId) });
        }
    });
}
