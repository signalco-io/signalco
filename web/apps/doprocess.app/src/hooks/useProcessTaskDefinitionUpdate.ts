import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ProcessTaskDefinitionDto } from '../../app/api/dtos/dtos';
import { processTaskDefinitionsKey } from './useProcessTaskDefinitions';
import { processTaskDefinitionKey } from './useProcessTaskDefinition';

type TaskDefinitionUpdateArgs = {
    processId: string;
    taskDefinitionId: string;
    text?: string;
    type?: string;
    typeData?: string;
};

async function fetchPutProcessTaskDefinition(processId: string, taskDefinitionId: string, data: object) {
    await fetch(`/api/processes/${processId}/task-definitions/${taskDefinitionId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
}

export function useProcessTaskDefinitionUpdate() {
    const client = useQueryClient();
    return useMutation({
        mutationFn: ({ processId, taskDefinitionId, ...rest }: TaskDefinitionUpdateArgs) => fetchPutProcessTaskDefinition(processId, taskDefinitionId, {
            processId,
            taskDefinitionId,
            ...rest
        }),
        onMutate: async (newItem) => {
            await client.cancelQueries({ queryKey: processTaskDefinitionsKey(newItem.processId) });

            const previousItem = client.getQueryData(processTaskDefinitionKey(newItem.processId, newItem.taskDefinitionId));
            if (previousItem) {
                client.setQueryData(processTaskDefinitionKey(newItem.processId, newItem.taskDefinitionId), (old: ProcessTaskDefinitionDto) => {
                    return { ...old, ...newItem };
                });
            }

            const previousItems = client.getQueryData(processTaskDefinitionsKey(newItem.processId));
            if (previousItems) {
                client.setQueryData(processTaskDefinitionsKey(newItem.processId), (old: ProcessTaskDefinitionDto[]) => {
                    return old.map((item: ProcessTaskDefinitionDto) => {
                        if (item.id === newItem.taskDefinitionId) {
                            return { ...item, ...newItem };
                        }
                        return item;
                    });
                });
            }

            return { previousItems, previousItem };
        },
        onError: (_, { processId, taskDefinitionId }, context) => {
            if (context?.previousItems) {
                client.setQueryData(processTaskDefinitionsKey(processId), context.previousItems);
            }
            if (context?.previousItem) {
                client.setQueryData(processTaskDefinitionKey(processId, taskDefinitionId), context.previousItem);
            }
        },
        onSettled: (_, __, { processId }: TaskDefinitionUpdateArgs) => {
            client.invalidateQueries({ queryKey: processTaskDefinitionsKey(processId) });
        }
    });
}
