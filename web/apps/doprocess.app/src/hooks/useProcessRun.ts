import { useQuery } from '@tanstack/react-query';
import { ProcessRunDto } from '../../app/api/dtos/dtos';
import { processRunsKey } from './useProcessRuns';

export function processRunKey(processId?: string, runId?: string) {
    if (runId == null)
        return processRunsKey(processId);
    return [...processRunsKey(processId), runId];
}

async function fetchGetProcessRun(processId: string, runId: string) {
    const response = await fetch(`/api/processes/${processId}/runs/${runId}`);
    return await response.json() as ProcessRunDto | undefined;
}

export function useProcessRun(processId?: string, runId?: string) {
    return useQuery({
        queryKey: processRunKey(processId, runId),
        queryFn: async () => {
            if (!processId || !runId)
                throw new Error('Process Id and Run Id is required');
            return await fetchGetProcessRun(processId, runId);
        },
        enabled: processId != null && runId != null,
    })
}
