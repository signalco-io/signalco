import { useMutation, useQueryClient } from '@tanstack/react-query';
import { processTaskDefinitionsKey } from './useProcessTaskDefinitions';

type TaskDefinitionUpdateArgs = {
    processId: string;
    taskDefinitionId: string;
    text: string;
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
        onSuccess: (_, { processId }: TaskDefinitionUpdateArgs) => {
            client.invalidateQueries({ queryKey: processTaskDefinitionsKey(processId) });
        }
    });
}
