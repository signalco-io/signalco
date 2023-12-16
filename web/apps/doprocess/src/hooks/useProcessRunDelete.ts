import { UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query';
import { processRunsKey } from './useProcessRuns';

type ProcessRunDeleteArgs = {
    processId: string;
    runId: string;
}

async function fetchDeleteProcessAsync(processId: string, runId: string) {
    await fetch(`/api/processes/${processId}/runs/${runId}`, {
        method: 'DELETE',
    });
}

export function useProcessRunDelete(): UseMutationResult<void, Error, ProcessRunDeleteArgs, unknown> {
    const client = useQueryClient();
    return useMutation({
        mutationFn: ({ processId, runId }: ProcessRunDeleteArgs) => fetchDeleteProcessAsync(processId, runId),
        onSuccess: (_, { processId }) => {
            client.invalidateQueries({ queryKey: processRunsKey(processId) });
        }
    });
}
