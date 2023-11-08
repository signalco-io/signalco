import { useQuery } from '@tanstack/react-query';
import { Document } from '../lib/db/schema';
import { documentsKey } from './useDocuments';

export function documentKey(id?: string) {
    return [...documentsKey(), id];
}

async function fetchGetDocument(id: string) {
    const response = await fetch(`/api/documents/${id}`);
    return await response.json() as Document | undefined;
}

export function useDocument(id?: string) {
    return useQuery({
        queryKey: documentKey(id),
        queryFn: async () => {
            if (!id)
                throw new Error('Entity Id is required');
            return await fetchGetDocument(id);
        },
        enabled: id != null,
    })
}
