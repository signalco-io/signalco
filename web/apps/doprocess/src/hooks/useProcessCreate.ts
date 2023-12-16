import { UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query';
import { processesKey } from './useProcesses';

type ProcessCreateArgs = {
    name: string;
    basedOn?: string;
}

async function fetchPostProcess(data: object) {
    const response = await fetch('/api/processes', {
        method: 'POST',
        body: JSON.stringify(data),
    });
    return await response.json() as { id: string } | undefined;
}

export function useProcessCreate(): UseMutationResult<{
    id: string;
} | undefined, Error, ProcessCreateArgs, unknown> {
    const client = useQueryClient();
    return useMutation({
        mutationFn: ({ ...rest }: ProcessCreateArgs) => fetchPostProcess(({ ...rest })),
        onSuccess: () => {
            client.invalidateQueries({ queryKey: processesKey() });
        }
    });
}
