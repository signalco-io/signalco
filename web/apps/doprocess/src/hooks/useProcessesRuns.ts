import { UseQueryResult, useQuery } from '@tanstack/react-query';
import { ProcessRunDto } from '../../app/api/dtos/dtos';

export function processesRunsKey(...args: (string | undefined)[]) {
    return ['runs', ...args].filter(Boolean);
}

async function fetchGetProcessesRuns(stateFilter?: string) {
    const response = await fetch('/api/processes/runs');
    if (!response.ok) {
        throw new Error('Error fetching process runs');
    }

    const runs = await response.json() as ProcessRunDto[] | undefined;

    if (stateFilter)
        return runs?.filter(r => r.state === stateFilter);

    return runs;
}

export function useProcessesRuns(enabled?: boolean, stateFilter?: string): UseQueryResult<ProcessRunDto[] | undefined, Error> {
    return useQuery({
        queryKey: processesRunsKey(stateFilter),
        queryFn: () => fetchGetProcessesRuns(stateFilter),
        enabled: enabled,
    })
}
