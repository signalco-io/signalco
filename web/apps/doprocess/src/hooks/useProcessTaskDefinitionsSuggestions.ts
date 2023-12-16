import { UseQueryResult, useQuery } from '@tanstack/react-query';
import { ProcessTaskDefinitionsSuggestionsDto } from '../../app/api/dtos/dtos';
import { processKey } from './useProcess';

export function processTaskDefinitionsSuggestionsKey(processId?: string, nonce?: string | number) {
    return [...processKey(processId), 'taskDefinitions', 'suggestions', nonce].filter(Boolean);
}

export async function fetchGetProcessTaskDefinitionsSuggestions(processId: string) {
    const response = await fetch(`/api/processes/${processId}/task-definitions/suggestions`);
    if (response.status === 404)
        return null;
    return await response.json() as ProcessTaskDefinitionsSuggestionsDto | undefined;
}

export function useProcessTaskDefinitionsSuggestions(processId?: string, nonce?: string | number): UseQueryResult<ProcessTaskDefinitionsSuggestionsDto | null | undefined, Error> {
    return useQuery({
        queryKey: processTaskDefinitionsSuggestionsKey(processId, nonce),
        queryFn: async () => {
            if (!processId)
                throw new Error('Process ID is required');
            return await fetchGetProcessTaskDefinitionsSuggestions(processId);
        },
        enabled: processId != null,
        staleTime: Infinity,
    });
}
