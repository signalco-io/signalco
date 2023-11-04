import { useQuery } from '@tanstack/react-query';
import { ProcessRun } from '../lib/db/schema';
import { processKey } from './useProcess';

export function processRunsKey(processId?: string) {
    return [...processKey(processId), 'runs'];
}

async function fetchGetProcessRuns(processId: string) {
    const response = await fetch(`/api/processes/${processId}/runs`);
    return await response.json() as ProcessRun[] | undefined;
}

export function useProcessRuns(processId?: string) {
    return useQuery({
        queryKey: processRunsKey(processId),
        queryFn: async () => {
            if (!processId)
                throw new Error('Process Id is required');
            return await fetchGetProcessRuns(processId);
        },
        enabled: processId != null,
    })
}
