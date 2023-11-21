import { UseQueryResult, useQuery } from '@tanstack/react-query';
import { ProcessDto } from '../../app/api/dtos/dtos';
import { processesKey } from './useProcesses';

export function processKey(id: string | undefined) {
    if (id == null)
        return [...processesKey()];
    return [...processesKey(), id];
}

async function fetchGetProcess(id: string) {
    const response = await fetch(`/api/processes/${id}`);
    if (response.status === 404)
        return null;
    return await response.json() as ProcessDto | undefined;
}

export function useProcess(id?: string): UseQueryResult<ProcessDto | null | undefined, Error> {
    return useQuery({
        queryKey: processKey(id),
        queryFn: async () => {
            if (!id)
                throw new Error('Entity Id is required');
            return await fetchGetProcess(id);
        },
        enabled: id != null,
    })
}
