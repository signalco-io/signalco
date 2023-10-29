import { useQuery } from '@tanstack/react-query';
import { Process } from '../../src/lib/db/schema';
import { processesKey } from './useProcesses';

export function processKey(id?: string) {
    if (id == null)
        return [...processesKey()];
    return [...processesKey(), id];
}

async function fetchGetProcess(id: string) {
    const response = await fetch(`/api/processes/${id}`);
    return await response.json() as Process | undefined;
}

export function useProcess(id?: string) {
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
