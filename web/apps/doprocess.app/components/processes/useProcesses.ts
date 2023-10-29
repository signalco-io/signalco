import { useQuery } from '@tanstack/react-query';
import { Process } from '../../src/lib/db/schema';

export function processesKey() {
    return ['processes'];
}

async function fetchGetProcesses() {
    const response = await fetch('/api/processes');
    return await response.json() as Process[] | undefined;
}

export function useProcesses() {
    return useQuery({
        queryKey: processesKey(),
        queryFn: fetchGetProcesses,
    })
}
