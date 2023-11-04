import { useQuery } from '@tanstack/react-query';
import { ProcessRun } from '../lib/db/schema';
import { processKey } from './useProcess';

export function processRunKey(processId?: string, runId?: string) {
    if (runId == null)
        return [...processKey(processId), 'runs'];
    return [...processKey(processId), 'runs', runId];
}

async function fetchGetProcessRun(processId: string, runId: string) {
    const response = await fetch(`/api/processes/${processId}/runs/${runId}`);
    return await response.json() as ProcessRun | undefined;
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
