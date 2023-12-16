import { UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query';
import { processesKey } from './useProcesses';
import { processKey } from './useProcess';

type ProcessUpdateArgs = {
    processId: string;
    name?: string;
    sharedWithUsers?: string[];
}

async function fetchPutProcess(processId: string, data: object) {
    await fetch(`/api/processes/${processId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
}

export function useProcessUpdate(): UseMutationResult<void, Error, ProcessUpdateArgs, unknown> {
    const client = useQueryClient();
    return useMutation({
        mutationFn: ({ processId, ...rest }: ProcessUpdateArgs) => fetchPutProcess(processId, ({ processId, ...rest })),
        onSuccess: (_, { processId }) => {
            client.invalidateQueries({ queryKey: processKey(processId) });
            client.invalidateQueries({ queryKey: processesKey() });
        }
    });
}
