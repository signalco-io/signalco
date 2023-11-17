import { useQuery } from '@tanstack/react-query';
import { ProcessRunDto } from '../../app/api/dtos/dtos';
import { processKey } from './useProcess';

export function processRunsKey(processId: string | undefined) {
    return [...processKey(processId), 'runs'];
}

async function fetchGetProcessRuns(processId: string) {
    const response = await fetch(`/api/processes/${processId}/runs`);
    if (response.status === 404)
        return null;
    return await response.json() as ProcessRunDto[] | undefined;
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
