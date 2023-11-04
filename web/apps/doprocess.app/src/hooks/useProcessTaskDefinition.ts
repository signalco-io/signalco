import { useQuery } from '@tanstack/react-query';
import { TaskDefinition } from '../lib/db/schema';
import { processTaskDefinitionsKey } from './useProcessTaskDefinitions';

export function processTaskDefinitionKey(processId?: string, taskDefinition?: string) {
    if (taskDefinition == null)
        return processTaskDefinitionsKey(processId);
    return [...processTaskDefinitionsKey(processId), taskDefinition];
}

async function fetchGetProcessTaskDefinition(processId: string, taskDefinitionId: string) {
    const response = await fetch(`/api/processes/${processId}/task-definitions/${taskDefinitionId}`);
    if (!response.ok)
        return null;
    return await response.json() as TaskDefinition | undefined;
}

export function useProcessTaskDefinition(processId?: string, taskDefinitionId?: string) {
    return useQuery({
        queryKey: processTaskDefinitionKey(processId, taskDefinitionId),
        queryFn: async () => {
            if (!processId || !taskDefinitionId)
                throw new Error('Process Id and Task Definition Id is required');
            return await fetchGetProcessTaskDefinition(processId, taskDefinitionId);
        },
        enabled: processId != null && taskDefinitionId != null,
    })
}
