import { useQuery } from '@tanstack/react-query';
import { ProcessRun } from '../lib/db/schema';

export function processesRunsKey() {
    return ['runs'];
}

async function fetchGetProcessesRuns() {
    const response = await fetch('/api/processes/runs');
    return await response.json() as ProcessRun[] | undefined;
}

export function useProcessesRuns() {
    return useQuery({
        queryKey: processesRunsKey(),
        queryFn: fetchGetProcessesRuns
    })
}
