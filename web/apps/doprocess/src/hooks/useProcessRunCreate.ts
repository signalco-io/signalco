import { UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query';
import { processKey } from './useProcess';

type ProcessRunCreateArgs = {
    processId: string;
    name: string;
}

async function fetchPostProcessRun(processId: string, data: object) {
    const response = await fetch(`/api/processes/${processId}/runs`, {
        method: 'POST',
        body: JSON.stringify(data)
    });
    return await response.json() as { id: string } | undefined;
}

export function useProcessRunCreate(): UseMutationResult<{
    id: string;
} | undefined, Error, ProcessRunCreateArgs, unknown> {
    const client = useQueryClient();
    return useMutation({
        mutationFn: ({ processId, ...rest }: ProcessRunCreateArgs) => fetchPostProcessRun(processId, rest),
        onSuccess: (_, { processId }: ProcessRunCreateArgs) => {
            client.invalidateQueries({ queryKey: processKey(processId) });
        }
    });
}
