import { UseQueryResult, useQuery } from '@tanstack/react-query';
import { ProcessRunDto } from '../../app/api/dtos/dtos';
import { processKey } from './useProcess';

export function processRunsKey(processId: string | undefined, ...args: (string | undefined)[]) {
    return [...processKey(processId), 'runs', ...args].filter(Boolean);
}

async function fetchGetProcessRuns(processId: string, stateFilter?: string) {
    const response = await fetch(`/api/processes/${processId}/runs`);
    if (response.status === 404)
        return null;
    const runs = await response.json() as ProcessRunDto[] | undefined;

    if (stateFilter)
        return runs?.filter(r => r.state === stateFilter);

    return runs;
}

export function useProcessRuns(processId?: string, stateFilter?: string): UseQueryResult<ProcessRunDto[] | null | undefined, Error> {
    return useQuery({
        queryKey: processRunsKey(processId, stateFilter),
        queryFn: () => {
            console.log('query process runs', stateFilter)
            if (!processId)
                throw new Error('Process Id is required');
            return fetchGetProcessRuns(processId, stateFilter);
        },
        enabled: processId != null,
    })
}
