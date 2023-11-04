import { useMutation, useQueryClient } from '@tanstack/react-query';
import { processesKey } from './useProcesses';

type ProcessCreateArgs = {
    name: string;
}

async function fetchPostProcess(data: object) {
    const response = await fetch('/api/processes', {
        method: 'POST',
        body: JSON.stringify(data),
    });
    return await response.json() as { id: string } | undefined;
}

export function useProcessCreate() {
    const client = useQueryClient();
    return useMutation({
        mutationFn: ({ name }: ProcessCreateArgs) => fetchPostProcess(({ name })),
        onSuccess: () => {
            client.invalidateQueries({ queryKey: processesKey() });
        }
    });
}
