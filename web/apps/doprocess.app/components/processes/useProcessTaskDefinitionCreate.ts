import { useMutation, useQueryClient } from '@tanstack/react-query';
import { processTaskDefinitionsKey } from './useProcessTaskDefinitions';

type TaskDefinitionCreateArgs = {
    processId: string;
    text?: string;
    description?: string;
}

async function fetchPostProcessTaskDefinition(processId: string, data: object) {
    const response = await fetch(`/api/processes/${processId}/task-definitions`, {
        method: 'POST',
        body: JSON.stringify(data),
    });
    return await response.json() as { id: string } | undefined;
}

export function useProcessTaskDefinitionCreate() {
    const client = useQueryClient();
    return useMutation({
        mutationFn: ({ processId, ...rest }: TaskDefinitionCreateArgs) => fetchPostProcessTaskDefinition(processId, rest),
        onSuccess: (_, {processId}: TaskDefinitionCreateArgs) => {
            client.invalidateQueries({ queryKey: processTaskDefinitionsKey(processId) });
        }
    });
}
