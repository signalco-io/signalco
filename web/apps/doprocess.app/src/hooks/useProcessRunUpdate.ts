import { UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query';
import { processRunsKey } from './useProcessRuns';
import { processRunKey } from './useProcessRun';

type ProcessRunUpdateArgs = {
    processId: string;
    runId: string;
    name: string;
}

async function fetchPutProcessRun(processId: string, runId: string, data: object) {
    await fetch(`/api/processes/${processId}/runs/${runId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
}

export function useProcessRunUpdate(): UseMutationResult<void, Error, ProcessRunUpdateArgs, unknown> {
    const client = useQueryClient();
    return useMutation({
        mutationFn: ({ processId, runId, name }: ProcessRunUpdateArgs) => fetchPutProcessRun(processId, runId, ({ processId, runId, name })),
        onSettled: (_, __, { processId, runId }) => {
            client.invalidateQueries({ queryKey: processRunKey(processId, runId) });
            client.invalidateQueries({ queryKey: processRunsKey(processId) });
        }
    });
}
