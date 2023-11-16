import { useMutation, useQueryClient } from '@tanstack/react-query';
import { documentsKey } from './useDocuments';

type DocumentCreateArgs = {
    name: string;
}

async function fetchPostDocument(data: object) {
    const response = await fetch('/api/documents', {
        method: 'POST',
        body: JSON.stringify(data),
    });
    return await response.json() as { id: string } | undefined;
}

export function useDocumentCreate() {
    const client = useQueryClient();
    return useMutation({
        mutationFn: ({ name }: DocumentCreateArgs) => fetchPostDocument(({ name })),
        onSuccess: () => {
            client.invalidateQueries({ queryKey: documentsKey() });
        }
    });
}
