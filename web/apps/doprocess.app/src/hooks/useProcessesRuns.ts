import { useQuery } from '@tanstack/react-query';
import { ProcessRunDto } from '../../app/api/dtos/dtos';

export function processesRunsKey() {
    return ['runs'];
}

async function fetchGetProcessesRuns() {
    const response = await fetch('/api/processes/runs');
    return await response.json() as ProcessRunDto[] | undefined;
}

export function useProcessesRuns(enabled?: boolean) {
    return useQuery({
        queryKey: processesRunsKey(),
        queryFn: fetchGetProcessesRuns,
        enabled: enabled,
    })
}
