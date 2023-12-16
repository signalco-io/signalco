import { UseQueryResult, useQuery } from '@tanstack/react-query';
import { ProcessDto } from '../../app/api/dtos/dtos';

export function processesKey() {
    return ['processes'];
}

async function fetchGetProcesses() {
    const response = await fetch('/api/processes');
    return await response.json() as ProcessDto[] | undefined;
}

export function useProcesses(): UseQueryResult<ProcessDto[] | undefined, Error> {
    return useQuery({
        queryKey: processesKey(),
        queryFn: fetchGetProcesses,
    })
}
