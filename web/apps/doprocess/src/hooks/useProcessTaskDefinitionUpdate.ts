import { UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query';
import { handleArrayOptimisticUpdate, handleOptimisticUpdate } from '../helpers/queryHelpers';
import { ProcessTaskDefinitionDto } from '../../app/api/dtos/dtos';
import { processTaskDefinitionsKey } from './useProcessTaskDefinitions';
import { processTaskDefinitionKey } from './useProcessTaskDefinition';

type TaskDefinitionUpdateArgs = {
    processId: string;
    taskDefinitionId: string;
    text?: string;
    type?: string;
    typeData?: string;
    order?: string;
};

async function fetchPutProcessTaskDefinition(processId: string, taskDefinitionId: string, data: object) {
    await fetch(`/api/processes/${processId}/task-definitions/${taskDefinitionId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
}

export function useProcessTaskDefinitionUpdate(): UseMutationResult<void, Error, TaskDefinitionUpdateArgs, {
    previousItems: unknown;
    previousItem: unknown;
}>
{
    const client = useQueryClient();
    return useMutation({
        mutationFn: ({ processId, taskDefinitionId, ...rest }: TaskDefinitionUpdateArgs) => fetchPutProcessTaskDefinition(processId, taskDefinitionId, {
            processId,
            taskDefinitionId,
            ...rest
        }),
        onMutate: async (newItem) => ({
            previousItems: await handleArrayOptimisticUpdate<ProcessTaskDefinitionDto, TaskDefinitionUpdateArgs>(client, processTaskDefinitionsKey(newItem.processId), newItem, (curr) => curr.id === newItem.taskDefinitionId),
            previousItem: await handleOptimisticUpdate(client, processTaskDefinitionKey(newItem.processId, newItem.taskDefinitionId), newItem)
        }),
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
