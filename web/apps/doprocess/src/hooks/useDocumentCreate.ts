import { UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query';
import { documentsKey } from './useDocuments';

type DocumentCreateArgs = {
    name: string;
    basedOn?: string;
}

async function fetchPostDocument(data: object) {
    const response = await fetch('/api/documents', {
        method: 'POST',
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error('Error creating document');
    }
    return await response.json() as { id: string } | undefined;
}

export function useDocumentCreate(): UseMutationResult<{
    id: string;
} | undefined, Error, DocumentCreateArgs, unknown> {
    const client = useQueryClient();
    return useMutation({
        mutationFn: ({ ...rest }: DocumentCreateArgs) => fetchPostDocument(({ ...rest })),
        onSuccess: () => {
            client.invalidateQueries({ queryKey: documentsKey() });
        }
    });
}
