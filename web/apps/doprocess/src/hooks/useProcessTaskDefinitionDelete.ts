import { UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query';
import { processTaskDefinitionsKey } from './useProcessTaskDefinitions';

type ProcessTaskDefinitionDeleteArgs = {
    processId: string;
    taskDefinitionId: string;
}

async function fetchDeleteProcessTaskDefinitionAsync(processId: string, taskDefinitionId: string) {
    await fetch(`/api/processes/${processId}/task-definitions/${taskDefinitionId}`, {
        method: 'DELETE',
    });
}

export function useProcessTaskDefinitionDelete(): UseMutationResult<void, Error, ProcessTaskDefinitionDeleteArgs, unknown> {
    const client = useQueryClient();
    return useMutation({
        mutationFn: ({ processId, taskDefinitionId }: ProcessTaskDefinitionDeleteArgs) => fetchDeleteProcessTaskDefinitionAsync(processId, taskDefinitionId),
        onSuccess: (_, { processId }: ProcessTaskDefinitionDeleteArgs) => {
            client.invalidateQueries({ queryKey: processTaskDefinitionsKey(processId) });
        }
    });
}
