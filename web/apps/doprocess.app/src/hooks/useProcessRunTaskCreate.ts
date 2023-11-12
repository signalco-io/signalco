import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ProcessRunTaskDto } from '../../app/api/dtos/dtos';
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

export function useProcessRunTaskCreate() {
    const client = useQueryClient();
    return useMutation({
        mutationFn: ({ processId, runId, ...rest }: TaskCreateArgs) => fetchPostProcessRunTask(processId, runId, { processId, runId, ...rest }),
        onMutate: async (newItem) => {
            await client.cancelQueries({ queryKey: tasksKey(newItem.processId, newItem.runId) });

            const previousItems = client.getQueryData(tasksKey(newItem.processId, newItem.runId));
            if (previousItems) {
                client.setQueryData(tasksKey(newItem.processId, newItem.runId), (old: ProcessRunTaskDto[]) => {
                    return old.map((item: ProcessRunTaskDto) => {
                        if (item.taskDefinitionId === newItem.taskDefinitionId) {
                            return { ...item, ...newItem };
                        }
                        return item;
                    });
                });
            }

            return { previousItems };
        },
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
