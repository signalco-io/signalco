import { UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query';
import { documentsKey } from './useDocuments';
import { documentKey } from './useDocument';

type DocumentUpdateArgs = {
    id: string;
    name?: string;
    data?: string;
    sharedWithUsers?: string[];
}

async function fetchPutDocument(id: string, data: object) {
    await fetch(`/api/documents/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
}

export function useDocumentUpdate(): UseMutationResult<void, Error, DocumentUpdateArgs, unknown> {
    const client = useQueryClient();
    return useMutation({
        mutationFn: ({ id, ...rest }: DocumentUpdateArgs) => fetchPutDocument(id, ({ id, ...rest })),
        onSuccess: (_, { id }) => {
            client.invalidateQueries({ queryKey: documentKey(id) });
            client.invalidateQueries({ queryKey: documentsKey() });
        }
    });
}
