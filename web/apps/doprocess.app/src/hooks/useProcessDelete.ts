import { useMutation, useQueryClient } from '@tanstack/react-query';
import { processesKey } from './useProcesses';

type ProcessDeleteArgs = {
    id: string;
}

async function fetchDeleteProcessAsync(id: string) {
    await fetch(`/api/processes/${id}`, {
        method: 'DELETE',
    });
}

export function useProcessDelete() {
    const client = useQueryClient();
    return useMutation({
        mutationFn: ({ id }: ProcessDeleteArgs) => fetchDeleteProcessAsync(id),
        onSuccess: () => {
            client.invalidateQueries({ queryKey: processesKey() });
        }
    });
}
