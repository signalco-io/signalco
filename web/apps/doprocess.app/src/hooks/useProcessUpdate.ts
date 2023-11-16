import { useMutation, useQueryClient } from '@tanstack/react-query';
import { processesKey } from './useProcesses';
import { processKey } from './useProcess';

type ProcessUpdateArgs = {
    processId: string;
    name: string;
}

async function fetchPutProcess(processId: string, data: object) {
    await fetch(`/api/processes/${processId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
}

export function useProcessUpdate() {
    const client = useQueryClient();
    return useMutation({
        mutationFn: ({ processId, name }: ProcessUpdateArgs) => fetchPutProcess(processId, ({ processId, name })),
        onSuccess: (_, { processId }) => {
            client.invalidateQueries({ queryKey: processKey(processId) });
            client.invalidateQueries({ queryKey: processesKey() });
        }
    });
}
